import urllib.parse
raw_url = "/media/1773405932_a_detailed_oil_painting_of_a_brave_cat_exploring_a_misty_forest_23400500c757764b.webp?url=https%3A//black-forest-labs-flux-1-dev.hf.space/gradio_api/file%3D/tmp/gradio/21403f0e7774b0ecee4989e85cdfd384fe46d517b26c5fa41d0a97becdc4978b/image.webp"

parsed = urllib.parse.urlparse(raw_url)
qs = urllib.parse.parse_qs(parsed.query)

if 'url' in qs:
    actual_url = qs['url'][0]
    print(actual_url)
