#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.UI;
using MatchingGame.Core;
using MatchingGame.UI;
using MatchingGame.Audio;
using MatchingGame.VFX;
using MatchingGame.Utils;

namespace MatchingGame.EditorTools
{
    /// <summary>
    /// Unity Editor wizard script to automatically create TileData assets, 3D Mahjong TilePrefab,
    /// configure Sprites, and build the complete mobile game scene with 1 click.
    /// Tile Club / GamoVation quality visual builder.
    /// </summary>
    public class BuildHelper : MonoBehaviour
    {
        [MenuItem("Matching Game/1. Setup Game Assets & TileData")]
        public static void SetupAssets()
        {
            // 1. Configure Card Sprites Importer
            string[] tileIds = { "fox_4tailed", "cat_cosmic", "panda", "shiba", "dragon" };
            foreach (var id in tileIds)
            {
                string texturePath = $"Assets/Textures/Cards/tile_{id}.png";
                TextureImporter importer = AssetImporter.GetAtPath(texturePath) as TextureImporter;
                if (importer != null)
                {
                    if (importer.textureType != TextureImporterType.Sprite)
                    {
                        importer.textureType = TextureImporterType.Sprite;
                        importer.spriteImportMode = SpriteImportMode.Single;
                        importer.SaveAndReimport();
                    }
                }
            }

            // 2. Configure UI Sprites Importer
            string[] uiSprites = { "ui_card_bg", "ui_slot_tray", "ui_slot_cell", "ui_card_locked" };
            foreach (var name in uiSprites)
            {
                string texturePath = $"Assets/Textures/UI/{name}.png";
                TextureImporter importer = AssetImporter.GetAtPath(texturePath) as TextureImporter;
                if (importer != null)
                {
                    if (importer.textureType != TextureImporterType.Sprite)
                    {
                        importer.textureType = TextureImporterType.Sprite;
                        importer.spriteImportMode = SpriteImportMode.Single;
                        importer.SaveAndReimport();
                    }
                }
            }

            // 3. Create/Update TileData ScriptableObjects
            string folderPath = "Assets/Resources/Tiles";
            if (!AssetDatabase.IsValidFolder("Assets/Resources"))
            {
                AssetDatabase.CreateFolder("Assets", "Resources");
            }
            if (!AssetDatabase.IsValidFolder(folderPath))
            {
                AssetDatabase.CreateFolder("Assets/Resources", "Tiles");
            }

            string[] tileNames = { "4-Kuyruklu Tilki", "Kozmik Kedi", "Sevimli Panda", "Shiba Inu", "Ejderha" };
            Color[] bgColors = {
                new Color(1f, 0.96f, 0.92f),
                new Color(0.96f, 0.92f, 1f),
                new Color(0.92f, 1f, 0.96f),
                new Color(1f, 0.98f, 0.88f),
                new Color(0.92f, 0.98f, 1f)
            };

            for (int i = 0; i < tileIds.Length; i++)
            {
                string assetPath = $"{folderPath}/Tile_{tileIds[i]}.asset";
                TileData tile = AssetDatabase.LoadAssetAtPath<TileData>(assetPath);

                if (tile == null)
                {
                    tile = ScriptableObject.CreateInstance<TileData>();
                    AssetDatabase.CreateAsset(tile, assetPath);
                }

                SerializedObject so = new SerializedObject(tile);
                so.FindProperty("tileId").stringValue = tileIds[i];
                so.FindProperty("tileName").stringValue = tileNames[i];
                so.FindProperty("backgroundColor").colorValue = bgColors[i];

                string texturePath = $"Assets/Textures/Cards/tile_{tileIds[i]}.png";
                Sprite sprite = AssetDatabase.LoadAssetAtPath<Sprite>(texturePath);
                if (sprite != null)
                {
                    so.FindProperty("tileIcon").objectReferenceValue = sprite;
                }

                so.ApplyModifiedProperties();
                EditorUtility.SetDirty(tile);
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }

        [MenuItem("Matching Game/2. Auto-Build Mobile Game Scene & Prefabs")]
        public static void BuildCompleteGameScene()
        {
            SetupAssets();

            if (!AssetDatabase.IsValidFolder("Assets/Prefabs"))
            {
                AssetDatabase.CreateFolder("Assets", "Prefabs");
            }

            string prefabPath = "Assets/Prefabs/TilePrefab.prefab";
            GameObject tileObj = new GameObject("TilePrefab");
            tileObj.transform.localScale = new Vector3(0.42f, 0.52f, 1.0f); // Preserved card scale!
            
            Sprite cardBgSprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Textures/UI/ui_card_bg.png");
            if (cardBgSprite == null) cardBgSprite = SpriteUtils.GetCardBackgroundSprite();

            // 1. Drop Shadow Layer
            GameObject shadowChild = new GameObject("Shadow");
            shadowChild.transform.SetParent(tileObj.transform, false);
            shadowChild.transform.localPosition = new Vector3(0.04f, -0.04f, 0.05f);
            shadowChild.transform.localScale = Vector3.one;
            SpriteRenderer shadowSr = shadowChild.AddComponent<SpriteRenderer>();
            shadowSr.color = new Color(0, 0, 0, 0.40f);
            shadowSr.sortingOrder = 9;
            shadowSr.sprite = cardBgSprite;

            // 2. Tile White Top Face
            SpriteRenderer bgSr = tileObj.AddComponent<SpriteRenderer>();
            bgSr.color = Color.white;
            bgSr.sortingOrder = 11;
            bgSr.sprite = cardBgSprite;

            // 3. Tile Icon Sprite
            GameObject iconChild = new GameObject("Icon");
            iconChild.transform.SetParent(tileObj.transform, false);
            iconChild.transform.localPosition = new Vector3(0f, 0.02f, 0f);
            iconChild.transform.localScale = new Vector3(0.50f, 0.50f, 1f);
            SpriteRenderer iconSr = iconChild.AddComponent<SpriteRenderer>();
            iconSr.sortingOrder = 12;

            // 4. Lock Overlay Shadow Layer (%50+ Area Lock Shadow)
            GameObject lockChild = new GameObject("LockOverlay");
            lockChild.transform.SetParent(tileObj.transform, false);
            lockChild.transform.localScale = Vector3.one;
            SpriteRenderer lockSr = lockChild.AddComponent<SpriteRenderer>();
            lockSr.color = new Color(0.08f, 0.08f, 0.12f, 0.60f);
            lockSr.sortingOrder = 13;
            lockSr.sprite = cardBgSprite;
            lockSr.enabled = false;

            // EXACT MATCH COLLIDER BOUNDS: 1.0 x 1.25 matches ui_card_bg.png 100% precisely!
            BoxCollider2D collider = tileObj.AddComponent<BoxCollider2D>();
            collider.size = new Vector2(1.0f, 1.25f);
            collider.offset = Vector2.zero;

            TileController controller = tileObj.AddComponent<TileController>();

            SerializedObject soTile = new SerializedObject(controller);
            soTile.FindProperty("bgRenderer").objectReferenceValue = bgSr;
            soTile.FindProperty("iconRenderer").objectReferenceValue = iconSr;
            soTile.FindProperty("shadowRenderer").objectReferenceValue = shadowSr;
            soTile.FindProperty("lockOverlayRenderer").objectReferenceValue = lockSr;
            soTile.ApplyModifiedProperties();

            GameObject savedPrefab = PrefabUtility.SaveAsPrefabAsset(tileObj, prefabPath);
            DestroyImmediate(tileObj);

            // Create Scene Structure
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            // Main Camera (GamoVation Tile Club Portrait Camera)
            GameObject camObj = new GameObject("Main Camera");
            camObj.tag = "MainCamera";
            Camera cam = camObj.AddComponent<Camera>();
            cam.orthographic = true;
            cam.orthographicSize = 4.8f;
            cam.backgroundColor = new Color(0.06f, 0.08f, 0.15f);
            cam.clearFlags = CameraClearFlags.SolidColor;
            camObj.transform.position = new Vector3(0, 0, -10);

            camObj.AddComponent<AudioListener>();

            // Root Managers
            GameObject gmObj = new GameObject("GameManager");
            gmObj.AddComponent<GameManager>();

            GameObject audioObj = new GameObject("AudioManager");
            audioObj.AddComponent<AudioManager>();

            GameObject stackObj = new GameObject("TileStackManager");
            TileStackManager stackMgr = stackObj.AddComponent<TileStackManager>();

            SerializedObject soStack = new SerializedObject(stackMgr);
            soStack.FindProperty("tilePrefab").objectReferenceValue = savedPrefab;
            soStack.ApplyModifiedProperties();

            GameObject slotObj = new GameObject("SlotManager");
            slotObj.transform.position = new Vector3(0, -3.4f, 0);
            slotObj.AddComponent<SlotManager>();

            GameObject vfxObj = new GameObject("ParticleEffectManager");
            vfxObj.AddComponent<ParticleEffectManager>();

            // Assign levelTileTypes to GameManager
            SerializedObject soGm = new SerializedObject(gmObj.GetComponent<GameManager>());
            SerializedProperty propTileTypes = soGm.FindProperty("levelTileTypes");
            string[] tileGuids = AssetDatabase.FindAssets("t:TileData", new[] { "Assets/Resources/Tiles" });
            propTileTypes.arraySize = tileGuids.Length;
            for (int i = 0; i < tileGuids.Length; i++)
            {
                string path = AssetDatabase.GUIDToAssetPath(tileGuids[i]);
                propTileTypes.GetArrayElementAtIndex(i).objectReferenceValue = AssetDatabase.LoadAssetAtPath<TileData>(path);
            }
            soGm.ApplyModifiedProperties();

            // Create Mobile Canvas UI
            GameObject canvasObj = new GameObject("Canvas");
            Canvas canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            
            CanvasScaler scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
            canvasObj.AddComponent<SafeArea>();
            canvasObj.AddComponent<UIManager>();

            if (!AssetDatabase.IsValidFolder("Assets/Scenes"))
            {
                AssetDatabase.CreateFolder("Assets", "Scenes");
            }
            string scenePath = "Assets/Scenes/MainGame.unity";
            EditorSceneManager.SaveScene(scene, scenePath);

            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(scenePath, true) };

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            EditorUtility.DisplayDialog("Mesafe Bazlı Çakışma Kilit Sistemi Hazır!", 
                "1. Kartların merkez mesafelerine dayalı hassas çakışma tespiti (Center Distance Threshold) entegre edildi.\n2. Üzerine başka bir kart binen TÜM KARTLAR 100% KİLİTLENDİ (gri gölgeli, titreyen).\n3. Üstü açık olan kartlar BEYAZ ve SEÇİLEBİLİRDİR!\n\nŞimdi Play butonuna basabilirsiniz!", 
                "Harika!");
        }
    }
}
#endif
