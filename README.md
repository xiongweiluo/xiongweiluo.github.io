# Xiongwei Luo — Portfolio

Personal portfolio: https://xiongweiluo.github.io/

Static HTML, CSS, JavaScript and media. No build step or server dependency.

## Edit and preview

This repository is the maintained website source. Edit `index.html`, the `case-*.html` pages, their styles/scripts and referenced files in `assets/`.

```sh
python3 -m http.server 8818 --bind 127.0.0.1
```

Open http://127.0.0.1:8818/ and run `python3 tools/check-site.py` before publishing.

## Publish updates

GitHub Pages publishes the root of `main`. Push a commit to `main` to update the site automatically. For changes made through a pull request, merge it into `main` when ready. Local saves alone do not update the public site.

```sh
git add .
git commit -m "Update portfolio"
git push origin main
```

Check deployment status under the repository's Actions tab and Settings → Pages. Keep `.nojekyll` so files are served without Jekyll processing. No custom domain is currently configured.

## Included content

Homepage, eight case studies, six embedded LabelHub interface views, CV, and referenced media. Historical previews, alternative layouts and unused assets are excluded. The original editing workspace is preserved separately.
