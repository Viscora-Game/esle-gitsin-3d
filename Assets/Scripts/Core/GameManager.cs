using UnityEngine;
using System.Collections.Generic;
using MatchingGame.UI;
using MatchingGame.Audio;

namespace MatchingGame.Core
{
    public enum GameState
    {
        MainMenu,
        Playing,
        Paused,
        GameOver,
        Victory
    }

    /// <summary>
    /// Central game lifecycle controller managing score, level progression,
    /// game state transitions, and high scores.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Game State")]
        public GameState CurrentState { get; private set; } = GameState.MainMenu;

        [Header("Player Progress")]
        public int Score { get; private set; } = 0;
        public int HighScore { get; private set; } = 0;
        public int CurrentLevel { get; private set; } = 1;
        public int ComboCount { get; private set; } = 0;

        [Header("Data References")]
        [SerializeField] private List<TileData> levelTileTypes;

        private const string HighScoreKey = "MatchingGame_HighScore";

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                if (transform.parent != null) transform.SetParent(null);
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }

            HighScore = PlayerPrefs.GetInt(HighScoreKey, 0);
        }

        private void Start()
        {
            StartNewGame();
        }

        public void StartNewGame()
        {
            Score = 0;
            CurrentLevel = 1;
            ComboCount = 0;
            CurrentState = GameState.Playing;

            LoadCurrentLevel();
        }

        public void LoadCurrentLevel()
        {
            CurrentState = GameState.Playing;
            
            if (SlotManager.Instance != null) SlotManager.Instance.ClearSlot();
            if (TileStackManager.Instance != null)
            {
                int pairs = 6 + (CurrentLevel * 4); // Progressive difficulty
                TileStackManager.Instance.GenerateLevel(levelTileTypes, pairs);
            }

            UIManager.Instance?.UpdateUI();
        }

        public void AddScore(int basePoints)
        {
            ComboCount++;
            int points = basePoints * Mathf.Min(ComboCount, 5);
            Score += points;

            if (Score > HighScore)
            {
                HighScore = Score;
                PlayerPrefs.SetInt(HighScoreKey, HighScore);
                PlayerPrefs.Save();
            }

            UIManager.Instance?.UpdateUI();
        }

        public void ResetCombo()
        {
            ComboCount = 0;
        }

        public void TriggerGameOver(string reason)
        {
            if (CurrentState == GameState.GameOver) return;

            CurrentState = GameState.GameOver;
            Debug.Log($"GAME OVER: {reason}");

            if (AudioManager.Instance != null) AudioManager.Instance.PlayGameOverSound();
            UIManager.Instance?.ShowGameOverPanel(reason);
        }

        public void TriggerVictory()
        {
            if (CurrentState == GameState.Victory) return;

            CurrentState = GameState.Victory;
            Debug.Log("VICTORY! Level completed!");

            if (AudioManager.Instance != null) AudioManager.Instance.PlayVictorySound();
            UIManager.Instance?.ShowVictoryPanel();
        }

        public void NextLevel()
        {
            CurrentLevel++;
            LoadCurrentLevel();
        }

        public void RestartLevel()
        {
            LoadCurrentLevel();
        }
    }
}
