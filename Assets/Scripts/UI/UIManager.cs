using UnityEngine;
using UnityEngine.UI;
using MatchingGame.Core;

namespace MatchingGame.UI
{
    /// <summary>
    /// UI Manager handling mobile HUD, score displays, Game Over / Victory modals, and restart buttons.
    /// Safe null checks and universal UI bindings.
    /// </summary>
    public class UIManager : MonoBehaviour
    {
        public static UIManager Instance { get; private set; }

        [Header("HUD Text Elements")]
        [SerializeField] private Text scoreText;
        [SerializeField] private Text highScoreText;
        [SerializeField] private Text levelText;

        [Header("Modals & Panels")]
        [SerializeField] private GameObject gameOverPanel;
        [SerializeField] private Text gameOverReasonText;
        [SerializeField] private GameObject victoryPanel;
        [SerializeField] private Text victoryScoreText;

        [Header("Buttons")]
        [SerializeField] private Button restartButton;
        [SerializeField] private Button nextLevelButton;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            if (gameOverPanel != null) gameOverPanel.SetActive(false);
            if (victoryPanel != null) victoryPanel.SetActive(false);

            if (restartButton != null) restartButton.onClick.AddListener(OnRestartClicked);
            if (nextLevelButton != null) nextLevelButton.onClick.AddListener(OnNextLevelClicked);

            UpdateUI();
        }

        public void UpdateUI()
        {
            if (GameManager.Instance == null) return;

            SetTextValue(scoreText, $"Skor: {GameManager.Instance.Score}");
            SetTextValue(highScoreText, $"En Yüksek: {GameManager.Instance.HighScore}");
            SetTextValue(levelText, $"Seviye {GameManager.Instance.CurrentLevel}");
        }

        public void ShowGameOverPanel(string reason)
        {
            if (gameOverPanel != null) gameOverPanel.SetActive(true);
            SetTextValue(gameOverReasonText, reason);
        }

        public void ShowVictoryPanel()
        {
            if (victoryPanel != null) victoryPanel.SetActive(true);
            SetTextValue(victoryScoreText, $"Skorunuz: {GameManager.Instance?.Score ?? 0}");
        }

        private void SetTextValue(Text targetText, string value)
        {
            if (targetText != null)
            {
                targetText.text = value;
            }
        }

        private void OnRestartClicked()
        {
            if (gameOverPanel != null) gameOverPanel.SetActive(false);
            if (victoryPanel != null) victoryPanel.SetActive(false);

            GameManager.Instance?.RestartLevel();
        }

        private void OnNextLevelClicked()
        {
            if (victoryPanel != null) victoryPanel.SetActive(false);

            GameManager.Instance?.NextLevel();
        }
    }
}
