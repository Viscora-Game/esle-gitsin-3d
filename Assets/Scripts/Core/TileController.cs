using System.Collections;
using UnityEngine;
using MatchingGame.Audio;
using MatchingGame.VFX;
using MatchingGame.Utils;

namespace MatchingGame.Core
{
    /// <summary>
    /// Tile Club / GamoVation style tile controller.
    /// Supports both Central Input Manager AND Unity OnMouseDown fallback with frame-based single click guarding.
    /// </summary>
    public class TileController : MonoBehaviour
    {
        private static int lastProcessedClickFrame = -1;

        [Header("Renderers")]
        [SerializeField] private SpriteRenderer bgRenderer;
        [SerializeField] private SpriteRenderer iconRenderer;
        [SerializeField] private SpriteRenderer shadowRenderer;
        [SerializeField] private SpriteRenderer lockOverlayRenderer;

        [Header("State")]
        public bool IsSelectable { get; private set; } = true;
        public bool IsInSlot { get; private set; } = false;
        public int LayerDepth { get; set; } = 0;
        public int SortingOrder { get; private set; } = 0;
        public TileData Data { get; private set; }

        private Vector3 targetPosition;
        private Vector3 targetScale = Vector3.one;
        private bool isMoving = false;
        private bool isShaking = false;

        private System.Action<TileController> onClickCallback;

        public void Initialize(TileData tileData, System.Action<TileController> clickCallback)
        {
            Data = tileData;
            onClickCallback = clickCallback;
            targetPosition = transform.position;
            targetScale = transform.localScale;

            UpdateVisuals();
            SetSelectableState(true);
        }

        public void UpdateVisuals()
        {
            if (Data == null) return;

            if (iconRenderer != null)
            {
                Sprite icon = Data.tileIcon;
                if (icon == null)
                {
                    icon = SpriteUtils.GetFallbackIcon(Data.tileId);
                }

                iconRenderer.sprite = icon;
                iconRenderer.enabled = true;
            }

            if (bgRenderer != null)
            {
                bgRenderer.color = Data.backgroundColor;
            }
        }

        public void SetSortingOrder(int baseOrder)
        {
            SortingOrder = baseOrder;
            if (shadowRenderer != null) shadowRenderer.sortingOrder = baseOrder - 1;
            if (bgRenderer != null) bgRenderer.sortingOrder = baseOrder;
            if (iconRenderer != null) iconRenderer.sortingOrder = baseOrder + 1;
            if (lockOverlayRenderer != null) lockOverlayRenderer.sortingOrder = baseOrder + 2;
        }

        public void SetSelectableState(bool selectable)
        {
            IsSelectable = selectable;

            if (lockOverlayRenderer != null)
            {
                lockOverlayRenderer.enabled = !selectable;
            }

            if (shadowRenderer != null)
            {
                shadowRenderer.enabled = selectable && !IsInSlot;
            }
        }

        public void MoveTo(Vector3 position, Vector3 scale, int baseOrder, System.Action onComplete = null)
        {
            targetPosition = position;
            targetScale = scale;
            
            SetSortingOrder(baseOrder);

            StopAllCoroutines();
            StartCoroutine(JuicyArcMoveRoutine(onComplete));
        }

        private IEnumerator JuicyArcMoveRoutine(System.Action onComplete)
        {
            isMoving = true;
            float duration = 0.20f;
            float elapsed = 0f;

            Vector3 startPos = transform.position;
            Vector3 startScale = transform.localScale;

            float arcHeight = IsInSlot ? 0.35f : 0.12f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;
                float easeT = Mathf.Sin(t * Mathf.PI * 0.5f);

                Vector3 currentPos = Vector3.Lerp(startPos, targetPosition, easeT);
                currentPos.y += Mathf.Sin(t * Mathf.PI) * arcHeight;

                Vector3 currentScale = Vector3.Lerp(startScale, targetScale, easeT);

                transform.position = currentPos;
                transform.localScale = currentScale;
                yield return null;
            }

            transform.position = targetPosition;
            transform.localScale = targetScale;
            isMoving = false;

            onComplete?.Invoke();
        }

        public void TriggerLockedShake()
        {
            if (isShaking || isMoving) return;
            StartCoroutine(ShakeTileRoutine());
        }

        private IEnumerator ShakeTileRoutine()
        {
            isShaking = true;
            Vector3 originalPos = transform.position;
            float elapsed = 0f;
            float duration = 0.16f;
            float shakeMagnitude = 0.08f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float xOffset = Mathf.Sin(elapsed * Mathf.PI * 40f) * shakeMagnitude;
                transform.position = originalPos + new Vector3(xOffset, 0f, 0f);
                yield return null;
            }

            transform.position = originalPos;
            isShaking = false;
        }

        public void SetInSlot(bool inSlot)
        {
            IsInSlot = inSlot;
            if (inSlot)
            {
                IsSelectable = false;
                if (shadowRenderer != null) shadowRenderer.enabled = false;
                if (lockOverlayRenderer != null) lockOverlayRenderer.enabled = false;
            }
        }

        private void OnMouseDown()
        {
            ProcessTopmostClick();
        }

        public void HandleDirectInputClick()
        {
            ProcessTopmostClick();
        }

        private void ProcessTopmostClick()
        {
            // Ensure ONLY 1 click per frame is processed globally
            if (Time.frameCount == lastProcessedClickFrame) return;

            // Find ALL colliders under mouse cursor
            Camera mainCam = Camera.main != null ? Camera.main : FindFirstObjectByType<Camera>();
            if (mainCam == null) return;

            Vector3 mouseWorldPos = mainCam.ScreenToWorldPoint(Input.mousePosition);
            Vector2 mousePos2D = new Vector2(mouseWorldPos.x, mouseWorldPos.y);

            Collider2D[] hits = Physics2D.OverlapPointAll(mousePos2D);
            TileController topTile = null;
            int highestOrder = -999999;

            foreach (var hit in hits)
            {
                if (hit == null) continue;
                TileController tile = hit.GetComponent<TileController>();
                if (tile != null && !tile.IsInSlot && !tile.isMoving)
                {
                    if (tile.SortingOrder > highestOrder)
                    {
                        highestOrder = tile.SortingOrder;
                        topTile = tile;
                    }
                }
            }

            // If a different tile is ABOVE this tile under the cursor, suppress click on this tile!
            if (topTile != null && topTile != this)
            {
                return;
            }

            lastProcessedClickFrame = Time.frameCount;
            HandleClick();
        }

        private void HandleClick()
        {
            if (IsInSlot || isMoving || isShaking) return;

            if (!IsSelectable)
            {
                TriggerLockedShake();

#if UNITY_ANDROID || UNITY_IOS
                Handheld.Vibrate();
#endif
                return;
            }

            if (AudioManager.Instance != null) AudioManager.Instance.PlayTileClickSound();

#if UNITY_ANDROID || UNITY_IOS
            Handheld.Vibrate();
#endif

            onClickCallback?.Invoke(this);
        }
    }
}
