change directory to the service folder and run the integration tests with a single command:

```bash
TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock TESTCONTAINERS_RYUK_DISABLED=true npm run test:integration
```


sometimes need to reset the podman machine first:

> podman machine list      
> podman machine stop podman-machine-default
> podman machine start podman-machine-default

then run the tests again.