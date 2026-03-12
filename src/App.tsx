import { FormEvent, useEffect, useMemo, useState } from 'react';
import { loadPosts, savePosts } from './lib/storage';
import type { PostItem, PostType } from './types';

type FilterType = 'all' | PostType;

const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

function formatDate(value: string): string {
  return DATE_FORMATTER.format(new Date(value));
}

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function App() {
  const [posts, setPosts] = useState<PostItem[]>(() => loadPosts());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [activePostId, setActivePostId] = useState<string>('');

  const [type, setType] = useState<PostType>('article');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return posts
      .filter((post) => (filter === 'all' ? true : post.type === filter))
      .filter((post) => {
        if (!normalizedQuery) {
          return true;
        }

        const searchable = `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLowerCase();
        return searchable.includes(normalizedQuery);
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [posts, filter, query]);

  const activePost = useMemo(() => {
    if (activePostId) {
      const found = filteredPosts.find((post) => post.id === activePostId);
      if (found) {
        return found;
      }
    }

    return filteredPosts[0] ?? null;
  }, [activePostId, filteredPosts]);

  useEffect(() => {
    if (!activePost && filteredPosts.length > 0) {
      setActivePostId(filteredPosts[0].id);
      return;
    }

    if (activePost) {
      setActivePostId(activePost.id);
    }
  }, [activePost, filteredPosts]);

  const totalComments = useMemo(
    () => posts.reduce((acc, post) => acc + post.comments.length, 0),
    [posts]
  );

  const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const safeTitle = title.trim();
    const safeSummary = summary.trim();
    const safeBody = body.trim();
    const safeAuthor = author.trim();

    if (!safeTitle || !safeSummary || !safeBody || !safeAuthor) {
      return;
    }

    const preparedTags = tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);

    const newPost: PostItem = {
      id: createId(type),
      type,
      title: safeTitle,
      summary: safeSummary,
      body: safeBody,
      author: safeAuthor,
      tags: preparedTags,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    setPosts((current) => [newPost, ...current]);
    setActivePostId(newPost.id);

    setTitle('');
    setSummary('');
    setBody('');
    setAuthor('');
    setTags('');
  };

  const handleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes + 1
            }
          : post
      )
    );
  };

  const handleAddComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activePost) {
      return;
    }

    const safeAuthor = commentAuthor.trim();
    const safeText = commentText.trim();

    if (!safeAuthor || !safeText) {
      return;
    }

    setPosts((current) =>
      current.map((post) => {
        if (post.id !== activePost.id) {
          return post;
        }

        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: createId('comment'),
              author: safeAuthor,
              text: safeText,
              createdAt: new Date().toISOString()
            }
          ]
        };
      })
    );

    setCommentAuthor('');
    setCommentText('');
  };

  return (
    <div className="app-shell">
      <div className="background-layer" aria-hidden="true" />

      <header className="hero panel">
        <div className="brand-row">
          <img className="logo" src={`${import.meta.env.BASE_URL}logo.svg`} alt="Логотип CrossRoad" />
          <div>
            <p className="eyebrow">Учебный проект • рабочий прототип</p>
            <h1>CrossRoad</h1>
          </div>
        </div>

        <p className="hero-text">
          Платформа публикаций и дискуссий в современном формате: статьи, обсуждения, комментарии и быстрый запуск на GitHub Pages.
        </p>

        <div className="stats-grid">
          <article className="stat-card">
            <p>Материалов</p>
            <strong>{posts.length}</strong>
          </article>
          <article className="stat-card">
            <p>Комментариев</p>
            <strong>{totalComments}</strong>
          </article>
          <article className="stat-card">
            <p>Статус</p>
            <strong>Production-ready</strong>
          </article>
        </div>
      </header>

      <main className="workspace">
        <section className="panel form-panel">
          <h2>Создать публикацию</h2>
          <form onSubmit={handleCreatePost} className="editor-form">
            <div className="field-row">
              <label>
                Тип
                <select value={type} onChange={(event) => setType(event.target.value as PostType)}>
                  <option value="article">Статья</option>
                  <option value="discussion">Дискуссия</option>
                </select>
              </label>

              <label>
                Автор
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  placeholder="Ваше имя"
                  maxLength={50}
                />
              </label>
            </div>

            <label>
              Заголовок
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Например: Как развивать проект после MVP"
                maxLength={100}
              />
            </label>

            <label>
              Краткое описание
              <input
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="1-2 предложения о материале"
                maxLength={160}
              />
            </label>

            <label>
              Основной текст
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Опишите идею, задачу или опыт"
                rows={5}
                maxLength={1200}
              />
            </label>

            <label>
              Теги через запятую
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="react, ux, roadmap"
                maxLength={80}
              />
            </label>

            <button type="submit" className="primary-button">
              Опубликовать
            </button>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="list-topbar">
            <h2>Лента</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по заголовку и тегам"
            />
          </div>

          <div className="filter-group">
            <button
              className={filter === 'all' ? 'chip active' : 'chip'}
              onClick={() => setFilter('all')}
              type="button"
            >
              Все
            </button>
            <button
              className={filter === 'article' ? 'chip active' : 'chip'}
              onClick={() => setFilter('article')}
              type="button"
            >
              Статьи
            </button>
            <button
              className={filter === 'discussion' ? 'chip active' : 'chip'}
              onClick={() => setFilter('discussion')}
              type="button"
            >
              Дискуссии
            </button>
          </div>

          <div className="feed-list">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className={activePost?.id === post.id ? 'post-card active' : 'post-card'}
                onClick={() => setActivePostId(post.id)}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="post-meta">
                  <span>{post.type === 'article' ? 'Статья' : 'Дискуссия'}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <p className="empty">По этому фильтру пока ничего не найдено.</p>
            )}
          </div>
        </section>

        <aside className="panel detail-panel">
          {activePost ? (
            <>
              <div className="detail-head">
                <h2>{activePost.title}</h2>
                <button type="button" className="like-button" onClick={() => handleLike(activePost.id)}>
                  +1 поддержка ({activePost.likes})
                </button>
              </div>

              <p className="detail-summary">{activePost.summary}</p>
              <p className="detail-body">{activePost.body}</p>

              <div className="detail-info">
                <span>Автор: {activePost.author}</span>
                <span>{formatDate(activePost.createdAt)}</span>
              </div>

              <h3 className="comment-title">Комментарии ({activePost.comments.length})</h3>

              <div className="comment-list">
                {activePost.comments.map((comment) => (
                  <article key={comment.id} className="comment-card">
                    <header>
                      <strong>{comment.author}</strong>
                      <span>{formatDate(comment.createdAt)}</span>
                    </header>
                    <p>{comment.text}</p>
                  </article>
                ))}

                {activePost.comments.length === 0 && (
                  <p className="empty">Пока нет комментариев. Добавьте первый.</p>
                )}
              </div>

              <form className="comment-form" onSubmit={handleAddComment}>
                <label>
                  Имя
                  <input
                    value={commentAuthor}
                    onChange={(event) => setCommentAuthor(event.target.value)}
                    placeholder="Как к вам обращаться"
                    maxLength={40}
                  />
                </label>

                <label>
                  Комментарий
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    rows={3}
                    maxLength={400}
                    placeholder="Что думаете по теме?"
                  />
                </label>

                <button type="submit" className="primary-button">
                  Добавить комментарий
                </button>
              </form>
            </>
          ) : (
            <p className="empty">Лента пуста, создайте первую публикацию.</p>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
