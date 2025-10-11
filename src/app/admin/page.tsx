"use client";

import { useState, useEffect } from "react";
import { useAppRouter } from "@/hooks/useAppRouter";
import { apiService } from "@/lib/api";
import ChangePassword from "@/components/ChangePassword";
import styles from "./admin.module.css";

interface Sentence {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSentence, setNewSentence] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const router = useAppRouter();

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      const response = await apiService.sentences.getAll();
      setSentences(response.data);
    } catch (error: any) {
      console.error("获取语句失败:", error);
      if (error.response?.status === 401) {
        router.goToLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
      router.goToHome();
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  const handleAddSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSentence.trim()) return;

    setIsSubmitting(true);
    try {
      await apiService.sentences.create(newSentence.trim());
      setNewSentence("");
      fetchSentences();
    } catch (error: any) {
      console.error("添加语句失败:", error);
      if (error.response?.status === 401) {
        router.goToLogin();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSentence = async (id: number) => {
    if (!editingContent.trim()) return;

    setIsSubmitting(true);
    try {
      await apiService.sentences.update(id, editingContent.trim());
      setEditingId(null);
      setEditingContent("");
      fetchSentences();
    } catch (error: any) {
      console.error("编辑语句失败:", error);
      if (error.response?.status === 401) {
        router.goToLogin();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSentence = async (id: number) => {
    if (!confirm("确定要删除这条语句吗？")) return;

    try {
      await apiService.sentences.delete(id);
      fetchSentences();
    } catch (error: any) {
      console.error("删除语句失败:", error);
      if (error.response?.status === 401) {
        router.goToLogin();
      }
    }
  };

  const startEditing = (sentence: Sentence) => {
    setEditingId(sentence.id);
    setEditingContent(sentence.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent("");
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
        <h1 className={styles.title}>管理界面</h1>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowChangePassword(true)}
            className="btn btn-secondary"
          >
            修改密码
          </button>
          <button onClick={handleLogout} className="btn btn-minimal">
            退出登录
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.addSection}>
          <h2 className={styles.sectionTitle}>添加新语句</h2>
          <form onSubmit={handleAddSentence} className={styles.addForm}>
            <textarea
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              placeholder="输入新的英语语句..."
              className="input textarea"
              rows={4}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !newSentence.trim()}
            >
              {isSubmitting ? "添加中..." : "添加语句"}
            </button>
          </form>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>
            语句管理 ({sentences.length} 条)
          </h2>

          {sentences.length === 0 ? (
            <div className={styles.empty}>
              <p>还没有任何语句</p>
            </div>
          ) : (
            <div className={styles.sentenceList}>
              {sentences.map((sentence) => (
                <article key={sentence.id} className={styles.sentenceItem}>
                  {editingId === sentence.id ? (
                    <div className={styles.editForm}>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="input textarea"
                        rows={3}
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleEditSentence(sentence.id)}
                          className="btn btn-primary"
                          disabled={isSubmitting || !editingContent.trim()}
                        >
                          {isSubmitting ? "保存中..." : "保存"}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="btn btn-secondary"
                          disabled={isSubmitting}
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.sentenceContent}>
                        <p className={styles.sentenceText}>
                          {sentence.content}
                        </p>
                        <time className={styles.sentenceDate}>
                          {new Date(sentence.createdAt).toLocaleString("zh-CN")}
                        </time>
                      </div>
                      <div className={styles.sentenceActions}>
                        <button
                          onClick={() => startEditing(sentence)}
                          className="btn btn-minimal"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteSentence(sentence.id)}
                          className="btn btn-minimal"
                          style={{ color: "#dc2626" }}
                        >
                          删除
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
}
