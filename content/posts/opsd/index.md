---
title: "On-policy Self-Distillation 学习笔记"
excerpt: ""
tag: academic
publishedAt: "2026-07-24"
draft: true
---

On-Policy Self-Distillation (OPSD) trains a single model to act as both student and teacher by conditioning on different contexts — the student sees only the problem, while the teacher additionally sees the ground-truth solution — and performs token-level distribution matching along the student's own on-policy trajectories.