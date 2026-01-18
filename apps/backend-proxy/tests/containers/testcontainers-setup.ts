import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

// Type definitions for containers
type TestContainers = {
  postgres?: StartedPostgreSqlContainer;
  redis?: StartedRedisContainer;
  generic?: StartedTestContainer;
};

export class TestContainersManager {
  private containers: TestContainers = {};

  async startPostgres(): Promise<StartedPostgreSqlContainer> {
    if (this.containers.postgres) {
      return this.containers.postgres;
    }

    const container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('crypture_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .withReuse()
      .withExposedPorts(5432)
      .withStartupTimeout(120000)
      .start();

    this.containers.postgres = container;
    return container;
  }

  async startRedis(): Promise<StartedRedisContainer> {
    if (this.containers.redis) {
      return this.containers.redis;
    }

    const container = await new RedisContainer('redis:7-alpine')
      .withReuse()
      .withExposedPorts(6379)
      .withStartupTimeout(60000)
      .start();

    this.containers.redis = container;
    return container;
  }

  async startGeneric(image: string, port: number): Promise<StartedTestContainer> {
    const container = await new GenericContainer(image)
      .withReuse()
      .withExposedPorts(port)
      .withStartupTimeout(60000)
      .start();

    this.containers.generic = container;
    return container;
  }

  async stopAll(): Promise<void> {
    const stopPromises = Object.values(this.containers).map(container => {
      if (container) {
        return container.stop();
      }
      return Promise.resolve();
    });

    await Promise.all(stopPromises);
    this.containers = {};
  }

  getPostgresConnection(): string | undefined {
    if (!this.containers.postgres) {
      return undefined;
    }

    return this.containers.postgres.getConnectionUri();
  }

  getRedisConnection(): string | undefined {
    if (!this.containers.redis) {
      return undefined;
    }

    const host = this.containers.redis.getHost();
    const port = this.containers.redis.getMappedPort(6379);
    return `redis://${host}:${port}`;
  }

  getContainerPort(containerPort: number): number | undefined {
    if (this.containers.generic) {
      return this.containers.generic.getMappedPort(containerPort);
    }
    return undefined;
  }

  getContainerHost(): string | undefined {
    if (this.containers.generic) {
      return this.containers.generic.getHost();
    }
    return undefined;
  }
}

// Global test containers manager
export const testContainersManager = new TestContainersManager();
