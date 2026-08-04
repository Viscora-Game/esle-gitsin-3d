using UnityEngine;

namespace MatchingGame.Audio
{
    /// <summary>
    /// Procedural and AudioSource sound synthesizer for mobile audio effects.
    /// Works without external dependencies using procedural audio buffers when audio clips are absent.
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Audio Clips")]
        [SerializeField] private AudioClip tileClickClip;
        [SerializeField] private AudioClip matchPopClip;
        [SerializeField] private AudioClip gameOverClip;
        [SerializeField] private AudioClip victoryClip;

        private AudioSource audioSource;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                if (transform.parent != null) transform.SetParent(null);
                DontDestroyOnLoad(gameObject);
                audioSource = gameObject.AddComponent<AudioSource>();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void PlayTileClickSound()
        {
            if (tileClickClip != null)
            {
                audioSource.PlayOneShot(tileClickClip, 0.7f);
            }
            else
            {
                PlayProceduralTone(440f, 0.05f); // Crisp high click
            }
        }

        public void PlayMatchSound()
        {
            if (matchPopClip != null)
            {
                audioSource.PlayOneShot(matchPopClip, 0.9f);
            }
            else
            {
                PlayProceduralTone(880f, 0.12f); // Pleasant match chime
            }
        }

        public void PlayGameOverSound()
        {
            if (gameOverClip != null)
            {
                audioSource.PlayOneShot(gameOverClip, 1.0f);
            }
            else
            {
                PlayProceduralTone(220f, 0.4f); // Low defeat synth tone
            }
        }

        public void PlayVictorySound()
        {
            if (victoryClip != null)
            {
                audioSource.PlayOneShot(victoryClip, 1.0f);
            }
            else
            {
                PlayProceduralTone(659.25f, 0.3f); // High fanfare note E5
            }
        }

        private void PlayProceduralTone(float frequency, float duration)
        {
            int sampleRate = 44100;
            int sampleCount = Mathf.CeilToInt(sampleRate * duration);
            float[] samples = new float[sampleCount];

            for (int i = 0; i < sampleCount; i++)
            {
                float t = (float)i / sampleRate;
                float envelope = 1.0f - (t / duration); // Linear fadeout
                samples[i] = Mathf.Sin(2f * Mathf.PI * frequency * t) * envelope * 0.3f;
            }

            AudioClip clip = AudioClip.Create("ProceduralTone", sampleCount, 1, sampleRate, false);
            clip.SetData(samples, 0);
            audioSource.PlayOneShot(clip);
        }
    }
}
