using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MatchingGame.Core
{
    /// <summary>
    /// Spawns board tile layouts in stacked layers and calculates bulletproof Mahjong Overlap Locking
    /// using robust center-distance overlap detection.
    /// Uncovered cards are 100% unlocked (white, clickable). Covered cards are 100% locked (darkened overlay, shaking).
    /// </summary>
    public class TileStackManager : MonoBehaviour
    {
        public static TileStackManager Instance { get; private set; }

        [Header("Board Config")]
        [SerializeField] private GameObject tilePrefab;
        [SerializeField] private Vector2 tileDimensions = new Vector2(0.42f, 0.52f);
        [SerializeField] private float layerZOffset = -0.1f;

        private readonly List<TileController> activeBoardTiles = new List<TileController>();

        public int RemainingBoardTilesCount => activeBoardTiles.Count;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Update()
        {
            // CENTRALIZED SINGLE-POINT CLICK CONTROLLER
            if (Input.GetMouseButtonDown(0))
            {
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
                    if (tile != null && !tile.IsInSlot)
                    {
                        if (tile.SortingOrder > highestOrder)
                        {
                            highestOrder = tile.SortingOrder;
                            topTile = tile;
                        }
                    }
                }

                if (topTile != null)
                {
                    topTile.HandleDirectInputClick();
                }
            }
        }

        public void GenerateLevel(List<TileData> availableTileDataTypes, int totalPairs = 12)
        {
            ClearBoard();

            if (availableTileDataTypes == null || availableTileDataTypes.Count == 0)
            {
                Debug.LogError("No TileData types provided for level generation!");
                return;
            }

            List<TileData> levelTilePool = new List<TileData>();
            for (int i = 0; i < totalPairs; i++)
            {
                TileData chosenData = availableTileDataTypes[i % availableTileDataTypes.Count];
                levelTilePool.Add(chosenData);
                levelTilePool.Add(chosenData); // Always add pairs
            }

            ShuffleList(levelTilePool);

            List<Vector3> layoutPositions = GeneratePyramidPattern(levelTilePool.Count);

            for (int i = 0; i < levelTilePool.Count; i++)
            {
                Vector3 pos = layoutPositions[i];
                int layer = Mathf.RoundToInt(-pos.z / Mathf.Abs(layerZOffset));

                GameObject tileObj = Instantiate(tilePrefab, pos, Quaternion.identity, transform);
                TileController controller = tileObj.GetComponent<TileController>();

                if (controller != null)
                {
                    controller.Initialize(levelTilePool[i], OnBoardTileClicked);
                    controller.LayerDepth = layer;

                    // LAYER-PRIORITIZED SORTING ORDER:
                    // (layer * 100) + (i * 5) + 10 guarantees higher layer tiles render strictly above lower layer tiles!
                    controller.SetSortingOrder((layer * 100) + (i * 5) + 10);

                    activeBoardTiles.Add(controller);
                }
            }

            UpdateTileLockStates();
        }

        private List<Vector3> GeneratePyramidPattern(int tileCount)
        {
            List<Vector3> positions = new List<Vector3>();

            int currentLayer = 0;
            int placed = 0;
            int currentGridWidth = 4;
            int currentGridHeight = 4;

            float centerCenterY = 0.6f;

            while (placed < tileCount)
            {
                float offsetX = (currentGridWidth - 1) * tileDimensions.x * 0.5f;
                float offsetY = (currentGridHeight - 1) * tileDimensions.y * 0.5f;

                for (int x = 0; x < currentGridWidth; x++)
                {
                    for (int y = 0; y < currentGridHeight; y++)
                    {
                        if (placed >= tileCount) break;

                        float jitterX = (currentLayer % 2 == 1) ? tileDimensions.x * 0.5f : 0f;
                        float jitterY = (currentLayer % 2 == 1) ? tileDimensions.y * 0.5f : 0f;

                        float posX = (x * tileDimensions.x) - offsetX + jitterX;
                        float posY = (y * tileDimensions.y) - offsetY + jitterY + centerCenterY;
                        float posZ = currentLayer * layerZOffset;

                        positions.Add(new Vector3(posX, posY, posZ));
                        placed++;
                    }
                    if (placed >= tileCount) break;
                }

                currentLayer++;
                currentGridWidth = Mathf.Max(2, currentGridWidth - 1);
                currentGridHeight = Mathf.Max(2, currentGridHeight - 1);
            }

            return positions;
        }

        /// <summary>
        /// BULLETPROOF DISTANCE-BASED OVERLAP LOCK RULE:
        /// Check if any candidate tile (j) rendered above tile (i) is within 85% center distance threshold of tile (i).
        /// If YES -> Tile (i) is LOCKED (darkened overlay, shakes on click).
        /// If NO  -> Tile (i) is UNLOCKED (white face, clickable).
        /// </summary>
        public void UpdateTileLockStates()
        {
            float thresholdX = tileDimensions.x * 0.85f;
            float thresholdY = tileDimensions.y * 0.85f;

            for (int i = 0; i < activeBoardTiles.Count; i++)
            {
                TileController tile = activeBoardTiles[i];
                if (tile == null || tile.IsInSlot) continue;

                bool isLocked = false;

                for (int j = 0; j < activeBoardTiles.Count; j++)
                {
                    if (i == j) continue;
                    TileController candidateAboveTile = activeBoardTiles[j];

                    if (candidateAboveTile == null || candidateAboveTile.IsInSlot) continue;

                    // Tile j is ABOVE tile i if higher LayerDepth OR same LayerDepth with j > i
                    bool isAbove = (candidateAboveTile.LayerDepth > tile.LayerDepth) || 
                                   (candidateAboveTile.LayerDepth == tile.LayerDepth && j > i);

                    if (isAbove)
                    {
                        Vector3 posA = tile.transform.position;
                        Vector3 posB = candidateAboveTile.transform.position;

                        float distX = Mathf.Abs(posA.x - posB.x);
                        float distY = Mathf.Abs(posA.y - posB.y);

                        // If candidate tile j is directly stacked on top of tile i
                        if (distX < thresholdX && distY < thresholdY)
                        {
                            isLocked = true;
                            break;
                        }
                    }
                }

                tile.SetSelectableState(!isLocked);
            }
        }

        private void OnBoardTileClicked(TileController tile)
        {
            if (SlotManager.Instance == null) return;

            if (SlotManager.Instance.IsFull)
            {
                Debug.LogWarning("Slot is full! Cannot pick up tile.");
                return;
            }

            activeBoardTiles.Remove(tile);

            SlotManager.Instance.AddTileToSlot(tile, () =>
            {
                if (activeBoardTiles.Count == 0 && SlotManager.Instance.SlotCount == 0)
                {
                    GameManager.Instance?.TriggerVictory();
                }
            });

            UpdateTileLockStates();
        }

        public void ClearBoard()
        {
            foreach (var tile in activeBoardTiles)
            {
                if (tile != null) Destroy(tile.gameObject);
            }
            activeBoardTiles.Clear();
        }

        private void ShuffleList<T>(List<T> list)
        {
            for (int i = list.Count - 1; i > 0; i--)
            {
                int r = Random.Range(0, i + 1);
                T temp = list[i];
                list[i] = list[r];
                list[r] = temp;
            }
        }
    }
}
