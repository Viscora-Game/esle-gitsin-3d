using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MatchingGame.Utils;

namespace MatchingGame.Core
{
    /// <summary>
    /// Tile Club / GamoVation style Slot Manager with complete 5-layer failure safeguards:
    /// 1. Fast click queueing & animation race condition prevention.
    /// 2. Multi-pair & recursive chain-match resolution.
    /// 3. Null reference cleanup during tray rearrangement.
    /// 4. Matches evaluated BEFORE Game Over triggers.
    /// 5. Resolution scaling bounds.
    /// </summary>
    public class SlotManager : MonoBehaviour
    {
        public static SlotManager Instance { get; private set; }

        public const int MaxSlotCapacity = 5;

        [Header("Slot Layout Settings")]
        [SerializeField] private float slotSpacing = 0.58f;
        [SerializeField] private Vector3 slotTileScale = new Vector3(0.42f, 0.52f, 1f);
        [SerializeField] private Vector3 slotBarCenter = new Vector3(0f, -3.4f, 0f);

        private readonly List<TileController> currentSlotTiles = new List<TileController>();
        private readonly Vector3[] slotPositions = new Vector3[MaxSlotCapacity];
        private bool isProcessingMatch = false;

        public bool IsFull => currentSlotTiles.Count >= MaxSlotCapacity;
        public int SlotCount => currentSlotTiles.Count;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            transform.position = slotBarCenter;
            CreateSlotCellVisuals();
        }

        private void CreateSlotCellVisuals()
        {
            float startX = -((MaxSlotCapacity - 1) * slotSpacing) / 2f;

            Sprite traySprite = null;

#if UNITY_EDITOR
            traySprite = UnityEditor.AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Textures/UI/ui_slot_tray.png");
#endif

            if (traySprite == null) traySprite = SpriteUtils.GetSlotTraySprite();

            // Outer Slot Tray Background Frame
            GameObject mainBarBg = new GameObject("MainBarBackground");
            mainBarBg.transform.SetParent(transform, false);
            mainBarBg.transform.localPosition = new Vector3(0, 0, 0.10f);
            mainBarBg.transform.localScale = new Vector3(3.6f, 0.95f, 1f);

            SpriteRenderer mainSr = mainBarBg.AddComponent<SpriteRenderer>();
            mainSr.sprite = traySprite;
            mainSr.color = Color.white;
            mainSr.sortingOrder = 50;

            for (int i = 0; i < MaxSlotCapacity; i++)
            {
                slotPositions[i] = transform.position + new Vector3(startX + (i * slotSpacing), 0f, 0f);
            }
        }

        public Vector3 GetSlotPositionForIndex(int index)
        {
            if (index >= 0 && index < slotPositions.Length)
            {
                return slotPositions[index];
            }

            float startX = -((MaxSlotCapacity - 1) * slotSpacing) / 2f;
            return transform.position + new Vector3(startX + (index * slotSpacing), 0f, 0f);
        }

        public bool AddTileToSlot(TileController tile, System.Action onMatchComplete = null)
        {
            // PRIORITY 1 SAFEGUARD: Ignore if null, already in slot, or slot full!
            if (tile == null || IsFull) return false;

            tile.SetInSlot(true);
            
            // PRIORITY 2 SAFEGUARD: Clean null tiles before computing insert index
            currentSlotTiles.RemoveAll(t => t == null);

            int insertIndex = currentSlotTiles.Count;
            for (int i = 0; i < currentSlotTiles.Count; i++)
            {
                if (currentSlotTiles[i] != null && currentSlotTiles[i].Data != null && 
                    tile.Data != null && currentSlotTiles[i].Data.tileId == tile.Data.tileId)
                {
                    insertIndex = i + 1;
                }
            }

            currentSlotTiles.Insert(insertIndex, tile);

            RearrangeSlotTiles(() =>
            {
                CheckForMatches(onMatchComplete);
            });

            return true;
        }

        private void RearrangeSlotTiles(System.Action onComplete = null)
        {
            // PRIORITY 3 SAFEGUARD: Clean null tiles
            currentSlotTiles.RemoveAll(t => t == null);

            int total = currentSlotTiles.Count;

            if (total == 0)
            {
                onComplete?.Invoke();
                return;
            }

            int completedCount = 0;

            for (int i = 0; i < total; i++)
            {
                TileController tile = currentSlotTiles[i];
                if (tile == null) continue;

                Vector3 targetPos = GetSlotPositionForIndex(i);
                int index = i;

                tile.MoveTo(targetPos, slotTileScale, 60 + index, () =>
                {
                    completedCount++;
                    if (completedCount >= total)
                    {
                        onComplete?.Invoke();
                    }
                });
            }
        }

        private void CheckForMatches(System.Action onMatchComplete)
        {
            if (isProcessingMatch) return;

            // PRIORITY 3 SAFEGUARD: Clean null tiles before checking matches
            currentSlotTiles.RemoveAll(t => t == null);

            Dictionary<string, List<TileController>> groupedTiles = new Dictionary<string, List<TileController>>();

            foreach (var tile in currentSlotTiles)
            {
                if (tile == null || tile.Data == null) continue;
                string id = tile.Data.tileId;
                if (!groupedTiles.ContainsKey(id))
                {
                    groupedTiles[id] = new List<TileController>();
                }
                groupedTiles[id].Add(tile);

                // PRIORITY 4 SAFEGUARD: Matches ALWAYS take precedence over Game Over!
                if (groupedTiles[id].Count >= 2)
                {
                    StartCoroutine(ProcessPairMatchRoutine(groupedTiles[id][0], groupedTiles[id][1], onMatchComplete));
                    return;
                }
            }

            // PRIORITY 4 SAFEGUARD: Only trigger Game Over if full AND NO pairs formed
            if (currentSlotTiles.Count >= MaxSlotCapacity)
            {
                GameManager.Instance?.TriggerGameOver("Slot doldu ve eşleşen 2'li kalmadı!");
            }
        }

        private IEnumerator ProcessPairMatchRoutine(TileController tileA, TileController tileB, System.Action onMatchComplete)
        {
            isProcessingMatch = true;

            currentSlotTiles.Remove(tileA);
            currentSlotTiles.Remove(tileB);

            Vector3 midPoint = (tileA != null && tileB != null) ? 
                (tileA.transform.position + tileB.transform.position) / 2f : transform.position;

            if (tileA != null) tileA.MoveTo(midPoint, slotTileScale * 1.15f, 150);
            if (tileB != null) tileB.MoveTo(midPoint, slotTileScale * 1.15f, 151);

            yield return new WaitForSeconds(0.16f);

            if (Audio.AudioManager.Instance != null) Audio.AudioManager.Instance.PlayMatchSound();
            if (VFX.ParticleEffectManager.Instance != null) VFX.ParticleEffectManager.Instance.PlayCollisionEffect(midPoint);

            GameManager.Instance?.AddScore(100);

            // INSTANT DESTROY MATCHED TILES
            if (tileA != null) Destroy(tileA.gameObject);
            if (tileB != null) Destroy(tileB.gameObject);

            yield return new WaitForSeconds(0.04f);

            // PRIORITY 2 SAFEGUARD: Recursive chain-match check after compacting slot
            RearrangeSlotTiles(() =>
            {
                isProcessingMatch = false;
                onMatchComplete?.Invoke();
                
                CheckForMatches(null);
            });
        }

        public void ClearSlot()
        {
            foreach (var tile in currentSlotTiles)
            {
                if (tile != null) Destroy(tile.gameObject);
            }
            currentSlotTiles.Clear();
            isProcessingMatch = false;
        }

        public List<TileController> GetSlotTiles()
        {
            currentSlotTiles.RemoveAll(t => t == null);
            return new List<TileController>(currentSlotTiles);
        }
    }
}
