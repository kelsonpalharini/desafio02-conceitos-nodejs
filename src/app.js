const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
var repositories_likes = [];

app.get("/repositories", (request, response) => {
  const repositoriesWithLike = repositories.map((repository) => {
    repository.likes = repositories_likes.filter(
      (repository_likes) => repository_likes.repository_id === repository.id
    ).length;

    return repository;
  });

  return response.json(repositoriesWithLike);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs };

  repositories.push(repository);

  repository.likes = 0;

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  repository.likes = repositories_likes.filter(
    (repository) => repository.repository_id === id
  ).length;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(repositoryIndex, 1);
  repositories_likes = repositories_likes.filter(
    (repository) => repository.repository_id !== id
  );

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories_likes.push({ repository_id: id });

  repositories[repositoryIndex].likes = repositories_likes.filter(
    (repository) => repository.repository_id === id
  ).length;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
