"""Generate images with local ComfyUI (z-image-turbo, same settings as k5-images/manifest.json).

Usage:  python comfy_gen.py jobs.json
jobs.json = [{"id": "44-deer", "prompt": "...", "negative": "...", "w": 1024, "h": 576, "seed": 123}, ...]
Writes k5-images/webp/<id>.webp (800 px wide, like the existing images) and appends to review/science-review/images.json
(the card-image log). Skips ids whose webp already exists unless "force": true.
"""
import json, sys, time, os, urllib.request, io, random
from PIL import Image

HOST = 'http://127.0.0.1:8188'
ROOT = r'C:\ai\repos\science-biotech'
WEBP = os.path.join(ROOT, 'k5-images', 'webp')
LOG = os.path.join(ROOT, 'review', 'science-review', 'images.json')
STYLE = 'children\'s science book illustration, clean flat vector shapes, muted sophisticated palette, subtle paper texture, simple friendly faces, no text, no letters, no labels. '
NEG = 'text, letters, words, numbers, labels, watermark, logo, signature, blurry, distorted, extra limbs, scary, gore, '


def graph(prompt, negative, w, h, seed):
    return {
        '1': {'class_type': 'UNETLoader', 'inputs': {'unet_name': 'z_image_turbo_int8_convrot.safetensors', 'weight_dtype': 'default'}},
        '2': {'class_type': 'CLIPLoader', 'inputs': {'clip_name': 'qwen_3_4b_fp8_mixed.safetensors', 'type': 'lumina2', 'device': 'default'}},
        '3': {'class_type': 'VAELoader', 'inputs': {'vae_name': 'ae.safetensors'}},
        '4': {'class_type': 'ModelSamplingAuraFlow', 'inputs': {'model': ['1', 0], 'shift': 3.0}},
        '5': {'class_type': 'CLIPTextEncode', 'inputs': {'clip': ['2', 0], 'text': prompt}},
        '6': {'class_type': 'CLIPTextEncode', 'inputs': {'clip': ['2', 0], 'text': negative}},
        '7': {'class_type': 'EmptySD3LatentImage', 'inputs': {'width': w, 'height': h, 'batch_size': 1}},
        '8': {'class_type': 'KSampler', 'inputs': {'model': ['4', 0], 'positive': ['5', 0], 'negative': ['6', 0], 'latent_image': ['7', 0],
                                                  'seed': seed, 'steps': 8, 'cfg': 1.0, 'sampler_name': 'res_multistep', 'scheduler': 'simple', 'denoise': 1.0}},
        '9': {'class_type': 'VAEDecode', 'inputs': {'samples': ['8', 0], 'vae': ['3', 0]}},
        '10': {'class_type': 'SaveImage', 'inputs': {'images': ['9', 0], 'filename_prefix': 'sciReview'}},
    }


def post(path, obj):
    r = urllib.request.Request(HOST + path, json.dumps(obj).encode(), {'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(r, timeout=60))


def get(path):
    return urllib.request.urlopen(HOST + path, timeout=60).read()


def run(job):
    seed = job.get('seed') or random.randint(1, 2**31)
    w, h = job.get('w', 1024), job.get('h', 576)
    prompt = (job.get('raw') and job['prompt']) or (STYLE + job['prompt'])
    neg = NEG + job.get('negative', '')
    pid = post('/prompt', {'prompt': graph(prompt, neg, w, h, seed)})['prompt_id']
    for _ in range(600):
        hist = json.loads(get('/history/' + pid))
        if pid in hist:
            break
        time.sleep(1)
    else:
        raise RuntimeError('timeout ' + job['id'])
    h = hist[pid]
    if h['status'].get('status_str') == 'error':
        raise RuntimeError(json.dumps(h['status'])[:600])
    img = h['outputs']['10']['images'][0]
    data = get('/view?filename=%s&subfolder=%s&type=%s' % (img['filename'], img['subfolder'], img['type']))
    im = Image.open(io.BytesIO(data)).convert('RGB')
    im = im.resize((800, round(800 * im.height / im.width)), Image.LANCZOS)
    out = os.path.join(WEBP, job['id'] + '.webp')
    im.save(out, 'WEBP', quality=82)
    return seed, out


def main():
    jobs = json.load(open(sys.argv[1], encoding='utf-8'))
    log = json.load(open(LOG)) if os.path.exists(LOG) else {}
    for j in jobs:
        out = os.path.join(WEBP, j['id'] + '.webp')
        if os.path.exists(out) and not j.get('force'):
            print('skip', j['id']); continue
        seed, out = run(j)
        log[j['id']] = {'prompt': j['prompt'], 'seed': seed, 'file': out, 'unit': j.get('unit', ''), 'where': j.get('where', '')}
        json.dump(log, open(LOG, 'w', encoding='utf-8'), indent=1)
        print('ok', j['id'], seed, flush=True)


if __name__ == '__main__':
    main()
