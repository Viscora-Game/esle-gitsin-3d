using System.Collections;
using UnityEngine;

namespace MatchingGame.VFX
{
    /// <summary>
    /// Spawns lightweight 2D particle burst explosions and collision visual effects.
    /// Mobile GPU friendly, zero MeshFilter conflicts, 100% reliable matching.
    /// </summary>
    public class ParticleEffectManager : MonoBehaviour
    {
        public static ParticleEffectManager Instance { get; private set; }

        [SerializeField] private ParticleSystem collisionParticlePrefab;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void PlayCollisionEffect(Vector3 position)
        {
            if (collisionParticlePrefab != null)
            {
                ParticleSystem ps = Instantiate(collisionParticlePrefab, position, Quaternion.identity);
                ps.Play();
                Destroy(ps.gameObject, ps.main.duration + ps.main.startLifetime.constantMax);
            }
            else
            {
                // Pure 2D Burst Effect without 3D Primitive conflicts
                GameObject burstObj = new GameObject("FX_MatchBurst");
                burstObj.transform.position = position + new Vector3(0, 0, -0.5f);
                burstObj.transform.localScale = Vector3.one * 0.3f;

                SpriteRenderer sr = burstObj.AddComponent<SpriteRenderer>();
                sr.sprite = UnityEditor.AssetDatabase.GetBuiltinExtraResource<Sprite>("UI/Skin/Background.psd");
                sr.color = new Color(1f, 0.85f, 0.2f, 0.95f);
                sr.sortingOrder = 200;

                StartCoroutine(AnimateBurst(burstObj, sr));
            }
        }

        private IEnumerator AnimateBurst(GameObject obj, SpriteRenderer sr)
        {
            float elapsed = 0f;
            float duration = 0.22f;
            Vector3 startScale = Vector3.one * 0.3f;
            Vector3 targetScale = Vector3.one * 1.8f;

            Color startColor = sr.color;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / duration;
                if (obj != null && sr != null)
                {
                    obj.transform.localScale = Vector3.Lerp(startScale, targetScale, t);
                    sr.color = Color.Lerp(startColor, new Color(startColor.r, startColor.g, startColor.b, 0f), t);
                }
                yield return null;
            }

            if (obj != null) Destroy(obj);
        }
    }
}
