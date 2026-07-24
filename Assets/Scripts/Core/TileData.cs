using UnityEngine;

namespace MatchingGame.Core
{
    /// <summary>
    /// ScriptableObject defining the metadata and visuals for each card tile.
    /// Telifsiz / CC0 tile data definition.
    /// </summary>
    [CreateAssetMenu(fileName = "NewTileData", menuName = "Matching Game/Tile Data")]
    public class TileData : ScriptableObject
    {
        [Header("Tile Metadata")]
        public string tileId;
        public string tileName;
        public Sprite tileIcon;
        public Color iconColor = Color.white;
        public Color backgroundColor = new Color(0.95f, 0.95f, 1f);

        [Header("Audio Customization")]
        public AudioClip matchSoundOverride;
    }
}
