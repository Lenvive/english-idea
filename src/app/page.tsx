"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Sentence {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      const response = await fetch("/api/sentences");
      if (response.ok) {
        const data = await response.json();
        setSentences(data);
      }
    } catch (error) {
      console.error("获取语句失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className={styles.header}>
        <h1 className={styles.title}>English Ideas</h1>
        <p className={styles.subtitle}>时不时想出的英语语句</p>
        <Link href="/login" className="btn btn-minimal">
          我是管理员
        </Link>
      </header>

      <main className={styles.main}>
        {sentences.length === 0 ? (
          <div className={styles.empty}>
            <p>还没有任何语句</p>
          </div>
        ) : (
          <div className={styles.sentenceGrid}>
            {sentences.map((sentence) => (
              <article key={sentence.id} className={styles.sentenceCard}>
                <blockquote className={styles.sentenceContent}>
                  {sentence.content}
                </blockquote>
                <time className={styles.sentenceDate}>
                  {new Date(sentence.createdAt).toLocaleDateString("zh-CN")}
                </time>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
