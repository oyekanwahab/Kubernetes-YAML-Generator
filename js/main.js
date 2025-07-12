function renderForm() {
  const type = document.getElementById("resourceType").value;
  const formArea = document.getElementById("formArea");
  formArea.innerHTML = '';

  if (type === 'Pod') {
    formArea.innerHTML = `
      <label>Pod Name: <input type="text" id="name" /></label>
      <label>Image: <input type="text" id="image" value="nginx" /></label>
      <label>Container Port: <input type="number" id="port" value="80" /></label>
      <label>Restart Policy:
        <select id="restartPolicy">
          <option value="Always">Always</option>
          <option value="OnFailure">OnFailure</option>
          <option value="Never">Never</option>
        </select>
      </label>

      <label>Number of Sidecars: <input type="number" id="sidecarCount" value="0" min="0" onchange="renderSidecarFields()" /></label>

      <div id="sidecarFields" style="margin-left: 20px;"></div>
    `;
  } else if (type === 'Deployment') {
    formArea.innerHTML = `
      <label>Deployment Name: <input type="text" id="name" /></label>
      <label>Replicas: <input type="number" id="replicas" value="1" /></label>
      <label>Image: <input type="text" id="image" value="nginx" /></label>
      <label>Container Port: <input type="number" id="port" value="80" /></label>
    `;
  } else if (type === 'Service') {
    formArea.innerHTML = `
      <label>Service Name: <input type="text" id="name" /></label>
      <label>Type:
        <select id="serviceType">
          <option value="ClusterIP">ClusterIP</option>
          <option value="NodePort">NodePort</option>
          <option value="LoadBalancer">LoadBalancer</option>
        </select>
      </label>
      <label>Port: <input type="number" id="port" value="80" /></label>
      <label>Target Port: <input type="number" id="targetPort" value="80" /></label>
    `;
  }
}

function renderSidecarFields() {
  const count = parseInt(document.getElementById("sidecarCount").value, 10);
  const container = document.getElementById("sidecarFields");
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <fieldset style="margin-top: 10px; border: 1px dashed #ccc; padding: 10px;">
        <legend>Sidecar ${i + 1}</legend>
        <label>Name: <input type="text" id="sidecarName${i}" value="sidecar-${i + 1}" /></label>
        <label>Image: <input type="text" id="sidecarImage${i}" value="busybox" /></label>
        <label>Command: <input type="text" id="sidecarCommand${i}" value="sleep 3600" /></label>
      </fieldset>
    `;
  }
}

function generateYAML() {
  const type = document.getElementById("resourceType").value;
  let yaml = '';

  if (type === 'Pod') {
    const name = document.getElementById("name").value;
    const image = document.getElementById("image").value;
    const port = document.getElementById("port").value;
    const restartPolicy = document.getElementById("restartPolicy").value;
    const sidecarCount = parseInt(document.getElementById("sidecarCount").value, 10);

    let containers = `
  - name: ${image}
    image: ${image}
    ports:
      - containerPort: ${port}`;

    for (let i = 0; i < sidecarCount; i++) {
      const sidecarName = document.getElementById(`sidecarName${i}`).value;
      const sidecarImage = document.getElementById(`sidecarImage${i}`).value;
      const sidecarCommand = document.getElementById(`sidecarCommand${i}`).value;
      const commandArray = sidecarCommand.trim().split(/\s+/).map(c => `"${c}"`).join(', ');

      containers += `
  - name: ${sidecarName}
    image: ${sidecarImage}
    command: [${commandArray}]`;
    }

    yaml = `
apiVersion: v1
kind: Pod
metadata:
  name: ${name}
spec:
  containers:
${containers}
  restartPolicy: ${restartPolicy}
`.trim();
  } else if (type === 'Deployment') {
    const name = document.getElementById("name").value;
    const image = document.getElementById("image").value;
    const port = document.getElementById("port").value;
    const replicas = document.getElementById("replicas").value;

    yaml = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
        - name: ${name}
          image: ${image}
          ports:
            - containerPort: ${port}
`.trim();
  } else if (type === 'Service') {
    const name = document.getElementById("name").value;
    const port = document.getElementById("port").value;
    const targetPort = document.getElementById("targetPort").value;
    const serviceType = document.getElementById("serviceType").value;

    yaml = `
apiVersion: v1
kind: Service
metadata:
  name: ${name}
spec:
  selector:
    app: ${name}
  type: ${serviceType}
  ports:
    - protocol: TCP
      port: ${port}
      targetPort: ${targetPort}
`.trim();
  }

  document.getElementById("output").textContent = yaml;
}

function downloadYAML() {
  const text = document.getElementById("output").textContent;
  const blob = new Blob([text], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "k8s-resource.yaml";
  a.click();
  URL.revokeObjectURL(url);
}
