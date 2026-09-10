/*
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.viscoragame.eslegitsin3d;

import android.annotation.SuppressLint;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class LauncherActivity extends android.app.Activity {

    private static final String TAG = "EsleGitsinAdMob";
    private static final String BANNER_AD_UNIT_ID = "ca-app-pub-5810332619798187/5186661887";
    private static final String REWARDED_DEFAULT_ID = "ca-app-pub-5810332619798187/8395847375";
    private static final String INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-5810332619798187/7152535583";

    private WebView mWebView;
    private AdView mAdView;
    private RewardedAd mRewardedAd;
    private InterstitialAd mInterstitialAd;
    private boolean mIsRewardedLoading = false;
    private boolean mIsInterstitialLoading = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Safe orientation check (Android 8.0 Oreo crashes if orientation is forced on fullscreen themes)
        if (Build.VERSION.SDK_INT != Build.VERSION_CODES.O) {
            try {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            } catch (Throwable ignored) {}
        }

        // Root container (pitch dark background)
        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#03050a"));
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        // Setup WebViewAssetLoader to serve local assets securely via HTTPS
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        // Create Fullscreen Hardware Accelerated WebView
        mWebView = new WebView(this);
        mWebView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        mWebView.setBackgroundColor(Color.parseColor("#03050a"));

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        try {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        } catch (Throwable ignored) {}
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Register window.AndroidAdMob JavaScript Interface
        try {
            mWebView.addJavascriptInterface(new AdMobJavaScriptInterface(), "AndroidAdMob");
        } catch (Throwable t) {
            Log.e(TAG, "Error attaching AdMob JS Interface: " + t.getMessage());
        }

        mWebView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (request == null) return null;
                try {
                    Uri url = request.getUrl();
                    if (url != null && url.getHost() != null && "appassets.androidplatform.net".equalsIgnoreCase(url.getHost())) {
                        WebResourceResponse response = assetLoader.shouldInterceptRequest(url);
                        if (response != null) {
                            return response;
                        }
                    }
                } catch (Throwable t) {
                    Log.w(TAG, "AssetLoader interception error: " + t.getMessage());
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                if (failingUrl != null && failingUrl.contains("appassets.androidplatform.net")) {
                    try {
                        view.loadUrl("file:///android_asset/index.html");
                    } catch (Throwable ignored) {}
                }
            }
        });

        rootLayout.addView(mWebView);

        // Setup Native Banner AdView (safely guarded against missing Play Services)
        try {
            mAdView = new AdView(this);
            mAdView.setAdSize(AdSize.BANNER);
            mAdView.setAdUnitId(BANNER_AD_UNIT_ID);
            FrameLayout.LayoutParams bannerParams = new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT);
            bannerParams.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
            mAdView.setLayoutParams(bannerParams);
            mAdView.setVisibility(View.GONE);
            rootLayout.addView(mAdView);
        } catch (Throwable t) {
            Log.w(TAG, "Failed to create AdView: " + t.getMessage());
            mAdView = null;
        }

        setContentView(rootLayout);
        hideSystemUI();

        // Load local game directly from assets (0ms, 100% offline)
        try {
            mWebView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
        } catch (Throwable t) {
            Log.e(TAG, "Failed loading appassets URL, attempting direct file fallback: " + t.getMessage());
            try {
                mWebView.loadUrl("file:///android_asset/index.html");
            } catch (Throwable ignored) {}
        }

        // Pre-load rewarded & interstitial ad safely in background
        try {
            loadRewardedAd(REWARDED_DEFAULT_ID);
        } catch (Throwable ignored) {}
        try {
            loadInterstitialAd();
        } catch (Throwable ignored) {}
    }

    private void hideSystemUI() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                final WindowInsetsController controller = getWindow().getInsetsController();
                if (controller != null) {
                    controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                }
            } else {
                View decor = getWindow().getDecorView();
                if (decor != null) {
                    decor.setSystemUiVisibility(
                            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    );
                }
            }
        } catch (Throwable ignored) {}
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    // =========================================================
    // ADMOB REWARDED & BANNER & INTERSTITIAL IMPLEMENTATION
    // =========================================================

    private void loadRewardedAd(final String adUnitId) {
        try {
            if (mIsRewardedLoading || mRewardedAd != null) return;
            mIsRewardedLoading = true;

            AdRequest adRequest = new AdRequest.Builder().build();
            String unitId = (adUnitId != null && !adUnitId.isEmpty()) ? adUnitId : REWARDED_DEFAULT_ID;

            RewardedAd.load(this, unitId, adRequest, new RewardedAdLoadCallback() {
                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                    Log.w(TAG, "Rewarded ad failed to load: " + loadAdError.getMessage());
                    mRewardedAd = null;
                    mIsRewardedLoading = false;
                }

                @Override
                public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                    Log.d(TAG, "Rewarded ad loaded successfully.");
                    mRewardedAd = rewardedAd;
                    mIsRewardedLoading = false;
                }
            });
        } catch (Throwable t) {
            Log.w(TAG, "Error calling RewardedAd.load: " + t.getMessage());
            mRewardedAd = null;
            mIsRewardedLoading = false;
        }
    }

    private void loadInterstitialAd() {
        try {
            if (mIsInterstitialLoading || mInterstitialAd != null) return;
            mIsInterstitialLoading = true;

            AdRequest adRequest = new AdRequest.Builder().build();
            InterstitialAd.load(this, INTERSTITIAL_AD_UNIT_ID, adRequest, new InterstitialAdLoadCallback() {
                @Override
                public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                    mInterstitialAd = interstitialAd;
                    mIsInterstitialLoading = false;
                }

                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                    mInterstitialAd = null;
                    mIsInterstitialLoading = false;
                }
            });
        } catch (Throwable t) {
            Log.w(TAG, "Error calling InterstitialAd.load: " + t.getMessage());
            mInterstitialAd = null;
            mIsInterstitialLoading = false;
        }
    }

    public class AdMobJavaScriptInterface {

        @JavascriptInterface
        public void showRewardedAd() {
            showRewardedAd(REWARDED_DEFAULT_ID);
        }

        @JavascriptInterface
        public void showRewardedAd(final String adUnitId) {
            runOnUiThread(() -> {
                try {
                    final String targetUnitId = (adUnitId != null && !adUnitId.isEmpty()) ? adUnitId : REWARDED_DEFAULT_ID;

                    if (mRewardedAd != null) {
                        mRewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                            @Override
                            public void onAdDismissedFullScreenContent() {
                                mRewardedAd = null;
                                hideSystemUI();
                                loadRewardedAd(targetUnitId);
                            }

                            @Override
                            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                                mRewardedAd = null;
                                hideSystemUI();
                                loadRewardedAd(targetUnitId);
                            }
                        });

                        mRewardedAd.show(LauncherActivity.this, rewardItem -> {
                            Log.d(TAG, "User earned reward: " + rewardItem.getAmount());
                            runOnUiThread(() -> {
                                try {
                                    if (mWebView != null) {
                                        mWebView.evaluateJavascript("window.onAdMobRewardSuccess && window.onAdMobRewardSuccess();", null);
                                    }
                                } catch (Throwable ignored) {}
                            });
                        });
                    } else {
                        Log.w(TAG, "Rewarded ad not ready yet, loading now...");
                        loadRewardedAd(targetUnitId);
                    }
                } catch (Throwable t) {
                    Log.w(TAG, "Error showing rewarded ad: " + t.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void showBannerAd() {
            runOnUiThread(() -> {
                try {
                    if (mAdView != null) {
                        mAdView.setVisibility(View.VISIBLE);
                        AdRequest adRequest = new AdRequest.Builder().build();
                        mAdView.loadAd(adRequest);
                    }
                } catch (Throwable t) {
                    Log.w(TAG, "Error showing banner ad: " + t.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void hideBannerAd() {
            runOnUiThread(() -> {
                try {
                    if (mAdView != null) {
                        mAdView.setVisibility(View.GONE);
                    }
                } catch (Throwable t) {
                    Log.w(TAG, "Error hiding banner ad: " + t.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void showInterstitialAd() {
            runOnUiThread(() -> {
                try {
                    if (mInterstitialAd != null) {
                        mInterstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                            @Override
                            public void onAdDismissedFullScreenContent() {
                                mInterstitialAd = null;
                                hideSystemUI();
                                loadInterstitialAd();
                            }
                        });
                        mInterstitialAd.show(LauncherActivity.this);
                    } else {
                        loadInterstitialAd();
                    }
                } catch (Throwable t) {
                    Log.w(TAG, "Error showing interstitial ad: " + t.getMessage());
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        try {
            if (mWebView != null && mWebView.canGoBack()) {
                mWebView.goBack();
                return;
            }
        } catch (Throwable ignored) {}
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        try {
            if (mAdView != null) mAdView.pause();
        } catch (Throwable ignored) {}
        try {
            if (mWebView != null) mWebView.onPause();
        } catch (Throwable ignored) {}
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemUI();
        try {
            if (mAdView != null) mAdView.resume();
        } catch (Throwable ignored) {}
        try {
            if (mWebView != null) mWebView.onResume();
        } catch (Throwable ignored) {}
    }

    @Override
    protected void onDestroy() {
        try {
            if (mAdView != null) mAdView.destroy();
        } catch (Throwable ignored) {}
        try {
            if (mWebView != null) mWebView.destroy();
        } catch (Throwable ignored) {}
        super.onDestroy();
    }
}
