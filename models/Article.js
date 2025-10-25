class Article {
  constructor({ title, description, url, urlToImage, publishedAt, source, category, language, content = '', author = '' }) {
    this.id = Article.generateId();
    this.title = title;
    this.description = description;
    this.url = url;
    this.urlToImage = urlToImage;
    this.publishedAt = new Date(publishedAt);
    this.source = source;
    this.category = category;
    this.language = language;
    this.content = content;
    this.author = author;
    this.createdAt = new Date();
  }

  static generateId() {
    return '_' + Math.random().toString(36).substring(2, 11);
  }

  static fromNewsAPI(article, category = 'general') {
    return new Article({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name || 'Unknown',
      category: category,
      language: 'en',
      content: article.content,
      author: article.author,
    });
  }

  static fromGNews(article, category = 'general') {
    return new Article({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      source: article.source?.name || 'Unknown',
      category: category,
      language: article.language || 'en',
      content: article.content,
      author: '',
    });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      url: this.url,
      urlToImage: this.urlToImage,
      publishedAt: this.publishedAt,
      source: this.source,
      category: this.category,
      language: this.language,
      content: this.content,
      author: this.author,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Article;