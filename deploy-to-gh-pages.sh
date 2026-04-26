#!/bin/bash
# 部署到 GitHub Pages
git config user.email "ci@example.com"
git config user.name "CI Bot"
git add -A
git commit -m "Deploy to GitHub Pages" || true
git push origin main
