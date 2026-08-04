using System.Collections.Generic;
using UnityEngine;

namespace MatchingGame.Utils
{
    /// <summary>
    /// Fallback 2D Sprite generator that creates crisp UI sprites and tile icons at runtime in memory.
    /// Standardized 100 PPU (Pixels Per Unit) for 100% pixel-perfect scale matching across all cards and slots!
    /// </summary>
    public static class SpriteUtils
    {
        private static Sprite cachedCardBgSprite;
        private static Sprite cachedSlotCellSprite;
        private static Sprite cachedSlotTraySprite;
        private static readonly Dictionary<string, Sprite> cachedFallbackIcons = new Dictionary<string, Sprite>();

        public static Sprite GetCardBackgroundSprite()
        {
            if (cachedCardBgSprite != null) return cachedCardBgSprite;

            int width = 100;
            int height = 125;
            Texture2D tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            Color[] colors = new Color[width * height];

            int radius = 12;
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    bool inCorner = false;
                    if (x < radius && y < radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(radius, radius)) > radius;
                    else if (x > width - radius && y < radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(width - radius, radius)) > radius;
                    else if (x < radius && y > height - radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(radius, height - radius)) > radius;
                    else if (x > width - radius && y > height - radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(width - radius, height - radius)) > radius;

                    if (inCorner)
                    {
                        colors[y * width + x] = Color.clear;
                    }
                    else
                    {
                        bool isBorder = (x <= 3 || x >= width - 4 || y <= 3 || y >= height - 4);
                        colors[y * width + x] = isBorder ? new Color(0.20f, 0.50f, 0.80f, 1f) : new Color(0.98f, 0.97f, 0.94f, 1f);
                    }
                }
            }

            tex.SetPixels(colors);
            tex.Apply();
            // Exactly 100 PPU => World size = 1.0 x 1.25 units
            cachedCardBgSprite = Sprite.Create(tex, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 100f);
            return cachedCardBgSprite;
        }

        public static Sprite GetSlotCellSprite()
        {
            if (cachedSlotCellSprite != null) return cachedSlotCellSprite;

            int width = 100;
            int height = 125;
            Texture2D tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            Color[] colors = new Color[width * height];

            int radius = 12;
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    bool inCorner = false;
                    if (x < radius && y < radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(radius, radius)) > radius;
                    else if (x > width - radius && y < radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(width - radius, radius)) > radius;
                    else if (x < radius && y > height - radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(radius, height - radius)) > radius;
                    else if (x > width - radius && y > height - radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(width - radius, height - radius)) > radius;

                    if (inCorner)
                    {
                        colors[y * width + x] = Color.clear;
                    }
                    else
                    {
                        bool isBorder = (x <= 4 || x >= width - 5 || y <= 4 || y >= height - 5);
                        colors[y * width + x] = isBorder ? new Color(0.35f, 0.75f, 1f, 0.95f) : new Color(0.08f, 0.12f, 0.22f, 0.85f);
                    }
                }
            }

            tex.SetPixels(colors);
            tex.Apply();
            // Exactly 100 PPU => World size = 1.0 x 1.25 units
            cachedSlotCellSprite = Sprite.Create(tex, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 100f);
            return cachedSlotCellSprite;
        }

        public static Sprite GetSlotTraySprite()
        {
            if (cachedSlotTraySprite != null) return cachedSlotTraySprite;

            int width = 450;
            int height = 145;
            Texture2D tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            Color[] colors = new Color[width * height];

            int radius = 20;
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    bool inCorner = false;
                    if (x < radius && y < radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(radius, radius)) > radius;
                    else if (x > width - radius && y < radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(width - radius, radius)) > radius;
                    else if (x < radius && y > height - radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(radius, height - radius)) > radius;
                    else if (x > width - radius && y > height - radius) inCorner = Vector2.Distance(new Vector2(x, y), new Vector2(width - radius, height - radius)) > radius;

                    if (inCorner)
                    {
                        colors[y * width + x] = Color.clear;
                    }
                    else
                    {
                        bool isBorder = (x <= 4 || x >= width - 5 || y <= 4 || y >= height - 5);
                        colors[y * width + x] = isBorder ? new Color(0.20f, 0.60f, 0.95f, 0.95f) : new Color(0.06f, 0.10f, 0.18f, 0.98f);
                    }
                }
            }

            tex.SetPixels(colors);
            tex.Apply();
            cachedSlotTraySprite = Sprite.Create(tex, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 100f);
            return cachedSlotTraySprite;
        }

        public static Sprite GetFallbackIcon(string tileId)
        {
            if (string.IsNullOrEmpty(tileId)) tileId = "default";
            if (cachedFallbackIcons.ContainsKey(tileId)) return cachedFallbackIcons[tileId];

            int width = 64;
            int height = 64;
            Texture2D tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            Color[] colors = new Color[width * height];

            Color mainColor = Color.yellow;
            if (tileId.Contains("fox")) mainColor = new Color(0.95f, 0.50f, 0.10f);
            else if (tileId.Contains("cat")) mainColor = new Color(0.60f, 0.30f, 0.90f);
            else if (tileId.Contains("panda")) mainColor = new Color(0.20f, 0.20f, 0.25f);
            else if (tileId.Contains("shiba")) mainColor = new Color(0.85f, 0.65f, 0.20f);
            else if (tileId.Contains("dragon")) mainColor = new Color(0.15f, 0.75f, 0.40f);

            Vector2 center = new Vector2(width * 0.5f, height * 0.5f);
            float radius = 24f;

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    float dist = Vector2.Distance(new Vector2(x, y), center);
                    colors[y * width + x] = dist <= radius ? mainColor : Color.clear;
                }
            }

            tex.SetPixels(colors);
            tex.Apply();
            Sprite sprite = Sprite.Create(tex, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 100f);
            cachedFallbackIcons[tileId] = sprite;
            return sprite;
        }
    }
}
