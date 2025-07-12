// Global variables
let currentMode = 'easy';
let isEditMode = false;
let originalGeneratedYAML = '';

function toggleMode() {
  currentMode = document.getElementById("generationMode").value;
  renderForm(); // Re-render form with new mode
}

function renderForm() {
  const type = document.getElementById("resourceType").value;
  const formArea = document.getElementById("formArea");
  formArea.innerHTML = '';

  if (!type) return;

  // Generate form based on resource type and mode
  switch (type) {
    case 'Pod':
      renderPodForm();
      break;
    case 'Deployment':
      renderDeploymentForm();
      break;
    case 'Service':
      renderServiceForm();
      break;
    case 'ConfigMap':
      renderConfigMapForm();
      break;
    case 'Secret':
      renderSecretForm();
      break;
    case 'Namespace':
      renderNamespaceForm();
      break;
    case 'PersistentVolume':
      renderPVForm();
      break;
    case 'PersistentVolumeClaim':
      renderPVCForm();
      break;
    case 'Ingress':
      renderIngressForm();
      break;
    case 'HorizontalPodAutoscaler':
      renderHPAForm();
      break;
    case 'Job':
      renderJobForm();
      break;
    case 'CronJob':
      renderCronJobForm();
      break;
    case 'DaemonSet':
      renderDaemonSetForm();
      break;
    case 'StatefulSet':
      renderStatefulSetForm();
      break;
    case 'ServiceAccount':
      renderServiceAccountForm();
      break;
    case 'Role':
      renderRoleForm();
      break;
    case 'RoleBinding':
      renderRoleBindingForm();
      break;
    case 'ClusterRole':
      renderClusterRoleForm();
      break;
    case 'ClusterRoleBinding':
      renderClusterRoleBindingForm();
      break;
    case 'NetworkPolicy':
      renderNetworkPolicyForm();
      break;
  }
}

function getPopularImages() {
  return {
    'Web Servers': [
      'nginx',
      'nginx:alpine',
      'httpd',
      'traefik:v3.0'
    ],
    'Databases': [
      'mysql',
      'mysql:8.0',
      'postgres',
      'postgres:15',
      'mongo',
      'mongo:7.0',
      'redis',
      'redis:alpine',
      'elasticsearch:8.11.0'
    ],
    'Application Runtimes': [
      'node:18-alpine',
      'node:20-alpine',
      'python:3.11-slim',
      'python:3.12-slim',
      'openjdk:17-jre-slim',
      'openjdk:21-jre-slim',
      'golang:1.21-alpine',
      'php:8.2-fpm'
    ],
    'Operating Systems': [
      'busybox',
      'alpine',
      'ubuntu:22.04',
      'ubuntu:20.04',
      'centos:7',
      'debian:12-slim'
    ],
    'Monitoring & DevOps': [
      'grafana/grafana',
      'prometheus/prometheus',
      'jenkins/jenkins:lts',
      'kibana:8.11.0',
      'consul',
      'vault'
    ]
  };
}

function createImageDropdown(selectedImage = 'nginx') {
  const imageCategories = getPopularImages();
  let options = '<option value="">-- Choose an Option --</option>';
  options += '<option value="custom">✏️ Enter Custom Image</option>';
  options += '<optgroup label="────────────────"></optgroup>';
  
  Object.entries(imageCategories).forEach(([category, images]) => {
    options += `<optgroup label="📦 ${category}">`;
    images.forEach(image => {
      const selected = image === selectedImage ? 'selected' : '';
      options += `<option value="${image}" ${selected}>${image}</option>`;
    });
    options += '</optgroup>';
  });
  
  return `
    <label>Container Image:
      <div class="image-selector">
        <select id="imageSelect" onchange="updateImageField()" style="margin-bottom: 8px;">
          ${options}
        </select>
        <input type="text" id="image" value="${selectedImage}" placeholder="Enter your custom image (e.g., myapp:v1.0, registry.example.com/myapp:latest)" style="font-family: 'Courier New', monospace;" />
      </div>
      <small style="color: #666; font-style: italic;">
        <strong>Option 1:</strong> Choose from popular images in the dropdown above<br>
        <strong>Option 2:</strong> Type your custom image directly in the text field<br>
        📋 Examples: <code>myapp:v1.0</code>, <code>registry.example.com/myapp:latest</code>, <code>gcr.io/project/app:tag</code>
      </small>
    </label>
  `;
}

function updateImageField() {
  const selectedImage = document.getElementById("imageSelect").value;
  const imageInput = document.getElementById("image");
  
  if (selectedImage === "custom") {
    // Clear the field and focus on it for custom entry
    imageInput.value = "";
    imageInput.focus();
    imageInput.placeholder = "Type your custom image here (e.g., myapp:v1.0)";
  } else if (selectedImage) {
    // Set the selected popular image
    imageInput.value = selectedImage;
    imageInput.placeholder = "Or modify this image name";
  }
}

function renderPodForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>Pod Name: <input type="text" id="name" placeholder="my-pod" /></label>
      ${createImageDropdown()}
      <label>Container Port: <input type="number" id="port" value="80" /></label>
      <label>Restart Policy:
        <select id="restartPolicy">
          <option value="Always">Always</option>
          <option value="OnFailure">OnFailure</option>
          <option value="Never">Never</option>
        </select>
      </label>
    </div>

    <div class="form-section">
      <h4>Container Configuration</h4>
      <label>Command (optional):
        <input type="text" id="command" placeholder="e.g., /bin/sh or python or java -jar app.jar" />
        <small style="color: #666;">Override the default entrypoint of the image</small>
      </label>
      <label>Arguments (optional):
        <input type="text" id="args" placeholder="e.g., -c 'echo hello' or app.py --port 8080" />
        <small style="color: #666;">Arguments to pass to the command</small>
      </label>
    </div>

    <div class="form-section">
      <h4>Volume Mounts</h4>
      <label>Number of Volume Mounts: <input type="number" id="volumeCount" value="0" min="0" max="10" onchange="renderVolumeFields()" /></label>
      <div id="volumeFields"></div>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>CPU Request: <input type="text" id="cpuRequest" placeholder="100m" /></label>
        <label>Memory Request: <input type="text" id="memoryRequest" placeholder="128Mi" /></label>
        <label>CPU Limit: <input type="text" id="cpuLimit" placeholder="500m" /></label>
        <label>Memory Limit: <input type="text" id="memoryLimit" placeholder="512Mi" /></label>
        <label>Environment Variables (JSON): <input type="text" id="envVars" placeholder='{"KEY": "value"}' /></label>
        <label>Number of Sidecars: <input type="number" id="sidecarCount" value="0" min="0" onchange="renderSidecarFields()" /></label>
        <div id="sidecarFields"></div>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

function renderSidecarFields() {
  const count = parseInt(document.getElementById("sidecarCount").value, 10);
  const container = document.getElementById("sidecarFields");
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const sidecarImages = {
      'Utility': ['busybox', 'alpine', 'ubuntu:22.04'],
      'Logging': ['fluent/fluent-bit', 'grafana/promtail'],
      'Proxy': ['nginx', 'envoyproxy/envoy'],
      'Monitoring': ['prom/node-exporter', 'jaegertracing/jaeger-agent']
    };
    
    let imageOptions = '<option value="">-- Select Sidecar Image --</option>';
    
    Object.entries(sidecarImages).forEach(([category, images]) => {
      imageOptions += `<optgroup label="${category}">`;
      images.forEach(image => {
        const selected = image === 'busybox' ? 'selected' : '';
        imageOptions += `<option value="${image}" ${selected}>${image}</option>`;
      });
      imageOptions += '</optgroup>';
    });

    container.innerHTML += `
      <fieldset style="margin-top: 10px;">
        <legend>Sidecar ${i + 1}</legend>
        <label>Name: <input type="text" id="sidecarName${i}" value="sidecar-${i + 1}" /></label>
        <label>Image:
          <select id="sidecarImageSelect${i}" onchange="document.getElementById('sidecarImage${i}').value = this.value" style="margin-bottom: 5px;">
            ${imageOptions}
          </select>
          <input type="text" id="sidecarImage${i}" value="busybox" placeholder="Or enter custom sidecar image" />
        </label>
        <label>Command: <input type="text" id="sidecarCommand${i}" value="sleep 3600" placeholder="e.g., sleep 3600 or /bin/sh -c 'while true; do echo hello; sleep 10; done'" /></label>
      </fieldset>
    `;
  }
}

function renderVolumeFields() {
  const count = parseInt(document.getElementById("volumeCount").value, 10);
  const container = document.getElementById("volumeFields");
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <fieldset style="margin-top: 15px;">
        <legend>Volume Mount ${i + 1}</legend>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <label>Volume Name: 
            <input type="text" id="volumeName${i}" value="volume-${i + 1}" placeholder="volume-${i + 1}" />
          </label>
          <label>Mount Path: 
            <input type="text" id="mountPath${i}" placeholder="/app/data" />
            <small style="color: #666;">Path inside container</small>
          </label>
        </div>

        <label>Volume Type:
          <select id="volumeType${i}" onchange="updateVolumeTypeFields(${i})">
            <option value="emptyDir">Empty Directory (temporary)</option>
            <option value="hostPath">Host Path</option>
            <option value="configMap">ConfigMap</option>
            <option value="secret">Secret</option>
            <option value="persistentVolumeClaim">Persistent Volume Claim</option>
          </select>
        </label>

        <div id="volumeTypeFields${i}">
          <small style="color: #666; font-style: italic;">EmptyDir: Temporary storage that gets deleted when pod is removed</small>
        </div>

        <div style="margin-top: 10px;">
          <label style="display: inline-flex; align-items: center;">
            <input type="checkbox" id="readOnly${i}" style="margin-right: 8px; width: auto;" />
            Read Only Mount
          </label>
        </div>
      </fieldset>
    `;
  }
}

function updateVolumeTypeFields(index) {
  const volumeType = document.getElementById(`volumeType${index}`).value;
  const container = document.getElementById(`volumeTypeFields${index}`);
  
  switch (volumeType) {
    case 'emptyDir':
      container.innerHTML = `
        <small style="color: #666; font-style: italic;">EmptyDir: Temporary storage that gets deleted when pod is removed</small>
      `;
      break;
    case 'hostPath':
      container.innerHTML = `
        <label>Host Path: 
          <input type="text" id="hostPath${index}" placeholder="/host/path" />
          <small style="color: #666;">Path on the host machine</small>
        </label>
        <label>Host Path Type:
          <select id="hostPathType${index}">
            <option value="">Default</option>
            <option value="DirectoryOrCreate">DirectoryOrCreate</option>
            <option value="Directory">Directory</option>
            <option value="FileOrCreate">FileOrCreate</option>
            <option value="File">File</option>
          </select>
        </label>
      `;
      break;
    case 'configMap':
      container.innerHTML = `
        <label>ConfigMap Name: 
          <input type="text" id="configMapName${index}" placeholder="my-configmap" />
        </label>
        <label>Items (optional, JSON): 
          <input type="text" id="configMapItems${index}" placeholder='[{"key": "config.yaml", "path": "config.yaml"}]' />
          <small style="color: #666;">Specific files to mount</small>
        </label>
      `;
      break;
    case 'secret':
      container.innerHTML = `
        <label>Secret Name: 
          <input type="text" id="secretName${index}" placeholder="my-secret" />
        </label>
        <label>Items (optional, JSON): 
          <input type="text" id="secretItems${index}" placeholder='[{"key": "username", "path": "username"}]' />
          <small style="color: #666;">Specific files to mount</small>
        </label>
      `;
      break;
    case 'persistentVolumeClaim':
      container.innerHTML = `
        <label>PVC Name: 
          <input type="text" id="pvcName${index}" placeholder="my-pvc" />
          <small style="color: #666;">Name of existing PersistentVolumeClaim</small>
        </label>
      `;
      break;
  }
}

function renderDeploymentForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>Deployment Name: <input type="text" id="name" placeholder="my-deployment" /></label>
      <label>Replicas: <input type="number" id="replicas" value="3" /></label>
      ${createImageDropdown()}
      <label>Container Port: <input type="number" id="port" value="80" /></label>
    </div>

    <div class="form-section">
      <h4>Container Configuration</h4>
      <label>Command (optional):
        <input type="text" id="command" placeholder="e.g., /bin/sh or python or java -jar app.jar" />
        <small style="color: #666;">Override the default entrypoint of the image</small>
      </label>
      <label>Arguments (optional):
        <input type="text" id="args" placeholder="e.g., -c 'echo hello' or app.py --port 8080" />
        <small style="color: #666;">Arguments to pass to the command</small>
      </label>
    </div>

    <div class="form-section">
      <h4>Volume Mounts</h4>
      <label>Number of Volume Mounts: <input type="number" id="volumeCount" value="0" min="0" max="10" onchange="renderVolumeFields()" /></label>
      <div id="volumeFields"></div>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>Strategy Type:
          <select id="strategyType">
            <option value="RollingUpdate">RollingUpdate</option>
            <option value="Recreate">Recreate</option>
          </select>
        </label>
        <label>Max Unavailable: <input type="text" id="maxUnavailable" value="25%" /></label>
        <label>Max Surge: <input type="text" id="maxSurge" value="25%" /></label>
        <label>CPU Request: <input type="text" id="cpuRequest" placeholder="100m" /></label>
        <label>Memory Request: <input type="text" id="memoryRequest" placeholder="128Mi" /></label>
        <label>CPU Limit: <input type="text" id="cpuLimit" placeholder="500m" /></label>
        <label>Memory Limit: <input type="text" id="memoryLimit" placeholder="512Mi" /></label>
        <label>Environment Variables (JSON): <input type="text" id="envVars" placeholder='{"KEY": "value"}' /></label>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

function renderServiceForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>Service Name: <input type="text" id="name" placeholder="my-service" /></label>
      <label>Type:
        <select id="serviceType">
          <option value="ClusterIP">ClusterIP</option>
          <option value="NodePort">NodePort</option>
          <option value="LoadBalancer">LoadBalancer</option>
        </select>
      </label>
      <label>Port: <input type="number" id="port" value="80" /></label>
      <label>Target Port: <input type="number" id="targetPort" value="80" /></label>
      <label>App Selector: <input type="text" id="appSelector" placeholder="my-app" /></label>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>Protocol:
          <select id="protocol">
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>
        </label>
        <label>Session Affinity:
          <select id="sessionAffinity">
            <option value="None">None</option>
            <option value="ClientIP">ClientIP</option>
          </select>
        </label>
        <label>External Traffic Policy:
          <select id="externalTrafficPolicy">
            <option value="Cluster">Cluster</option>
            <option value="Local">Local</option>
          </select>
        </label>
        <label>Additional Selectors (JSON): <input type="text" id="additionalSelectors" placeholder='{"version": "v1"}' /></label>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

function renderConfigMapForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>ConfigMap Name: <input type="text" id="name" placeholder="my-configmap" /></label>
      <label>Data (JSON): <input type="text" id="data" placeholder='{"config.yaml": "key: value"}' /></label>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>Binary Data (JSON): <input type="text" id="binaryData" placeholder='{"binary.dat": "base64data"}' /></label>
        <label>Immutable: 
          <select id="immutable">
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        </label>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

function renderSecretForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>Secret Name: <input type="text" id="name" placeholder="my-secret" /></label>
      <label>Type:
        <select id="secretType">
          <option value="Opaque">Opaque</option>
          <option value="kubernetes.io/dockerconfigjson">Docker Config</option>
          <option value="kubernetes.io/tls">TLS</option>
        </select>
      </label>
      <label>Data (JSON): <input type="text" id="data" placeholder='{"username": "YWRtaW4=", "password": "MWYyZDFlMmU2N2Rm"}' /></label>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>String Data (JSON): <input type="text" id="stringData" placeholder='{"config": "plain text"}' /></label>
        <label>Immutable: 
          <select id="immutable">
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        </label>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

function renderNamespaceForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>Namespace Name: <input type="text" id="name" placeholder="my-namespace" /></label>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>Labels (JSON): <input type="text" id="labels" placeholder='{"environment": "production"}' /></label>
        <label>Annotations (JSON): <input type="text" id="annotations" placeholder='{"description": "My namespace"}' /></label>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

function renderServiceAccountForm() {
  const formArea = document.getElementById("formArea");
  
  let html = `
    <div class="form-section">
      <h4>Basic Configuration</h4>
      <label>ServiceAccount Name: <input type="text" id="name" placeholder="my-service-account" /></label>
    </div>
  `;

  if (currentMode === 'pro') {
    html += `
      <div class="form-section pro-field">
        <h4>Advanced Configuration</h4>
        <label>Auto Mount Service Account Token: 
          <select id="automountServiceAccountToken">
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </label>
        <label>Image Pull Secrets (comma-separated): <input type="text" id="imagePullSecrets" placeholder="secret1,secret2" /></label>
        <label>Secrets (comma-separated): <input type="text" id="secrets" placeholder="secret1,secret2" /></label>
      </div>
    `;
  }

  formArea.innerHTML = html;
}

// Placeholder functions for other resource types
function renderPVForm() {
  document.getElementById("formArea").innerHTML = `<p>PersistentVolume form coming soon...</p>`;
}

function renderPVCForm() {
  document.getElementById("formArea").innerHTML = `<p>PersistentVolumeClaim form coming soon...</p>`;
}

function renderIngressForm() {
  document.getElementById("formArea").innerHTML = `<p>Ingress form coming soon...</p>`;
}

function renderHPAForm() {
  document.getElementById("formArea").innerHTML = `<p>HorizontalPodAutoscaler form coming soon...</p>`;
}

function renderJobForm() {
  document.getElementById("formArea").innerHTML = `<p>Job form coming soon...</p>`;
}

function renderCronJobForm() {
  document.getElementById("formArea").innerHTML = `<p>CronJob form coming soon...</p>`;
}

function renderDaemonSetForm() {
  document.getElementById("formArea").innerHTML = `<p>DaemonSet form coming soon...</p>`;
}

function renderStatefulSetForm() {
  document.getElementById("formArea").innerHTML = `<p>StatefulSet form coming soon...</p>`;
}

function renderRoleForm() {
  document.getElementById("formArea").innerHTML = `<p>Role form coming soon...</p>`;
}

function renderRoleBindingForm() {
  document.getElementById("formArea").innerHTML = `<p>RoleBinding form coming soon...</p>`;
}

function renderClusterRoleForm() {
  document.getElementById("formArea").innerHTML = `<p>ClusterRole form coming soon...</p>`;
}

function renderClusterRoleBindingForm() {
  document.getElementById("formArea").innerHTML = `<p>ClusterRoleBinding form coming soon...</p>`;
}

function renderNetworkPolicyForm() {
  document.getElementById("formArea").innerHTML = `<p>NetworkPolicy form coming soon...</p>`;
}

function generateYAML() {
  const type = document.getElementById("resourceType").value;
  let yaml = '';

  if (!type) {
    alert("Please select a resource type first.");
    return;
  }

  // Generate YAML based on resource type
  switch (type) {
    case 'Pod':
      yaml = generatePodYAML();
      break;
    case 'Deployment':
      yaml = generateDeploymentYAML();
      break;
    case 'Service':
      yaml = generateServiceYAML();
      break;
    case 'ConfigMap':
      yaml = generateConfigMapYAML();
      break;
    case 'Secret':
      yaml = generateSecretYAML();
      break;
    case 'Namespace':
      yaml = generateNamespaceYAML();
      break;
    case 'ServiceAccount':
      yaml = generateServiceAccountYAML();
      break;
    default:
      yaml = `# ${type} generation not implemented yet`;
  }

  // Store original generated YAML and display it
  originalGeneratedYAML = yaml;
  document.getElementById("output").textContent = yaml;
  
  // Reset to preview mode if in edit mode
  if (isEditMode) {
    toggleEditMode();
  }
  
  // Clear any previous validation status
  clearValidationStatus();
}

function generatePodYAML() {
  const name = document.getElementById("name").value || 'my-pod';
  const image = document.getElementById("image").value || 'nginx';
  const port = document.getElementById("port").value || '80';
  const restartPolicy = document.getElementById("restartPolicy").value || 'Always';
  const command = document.getElementById("command")?.value;
  const args = document.getElementById("args")?.value;

  let containerSpec = `  - name: ${name}
    image: ${image}`;

  // Add command if specified
  if (command) {
    const commandArray = command.trim().split(/\s+/).map(c => `"${c}"`).join(', ');
    containerSpec += `
    command: [${commandArray}]`;
  }

  // Add args if specified
  if (args) {
    const argsArray = args.trim().split(/\s+/).map(a => `"${a}"`).join(', ');
    containerSpec += `
    args: [${argsArray}]`;
  }

  // Add ports
  containerSpec += `
    ports:
    - containerPort: ${port}`;

  // Add volume mounts
  const volumeCount = parseInt(document.getElementById("volumeCount")?.value || 0);
  if (volumeCount > 0) {
    containerSpec += `
    volumeMounts:`;
    for (let i = 0; i < volumeCount; i++) {
      const volumeName = document.getElementById(`volumeName${i}`)?.value || `volume-${i + 1}`;
      const mountPath = document.getElementById(`mountPath${i}`)?.value;
      const readOnly = document.getElementById(`readOnly${i}`)?.checked;
      
      if (mountPath) {
        containerSpec += `
    - name: ${volumeName}
      mountPath: ${mountPath}`;
        if (readOnly) {
          containerSpec += `
      readOnly: true`;
        }
      }
    }
  }

  let yaml = `apiVersion: v1
kind: Pod
metadata:
  name: ${name}
spec:
  containers:
${containerSpec}
  restartPolicy: ${restartPolicy}`;

  // Add volumes
  if (volumeCount > 0) {
    yaml += `
  volumes:`;
    for (let i = 0; i < volumeCount; i++) {
      const volumeName = document.getElementById(`volumeName${i}`)?.value || `volume-${i + 1}`;
      const volumeType = document.getElementById(`volumeType${i}`)?.value || 'emptyDir';
      const mountPath = document.getElementById(`mountPath${i}`)?.value;
      
      if (mountPath) {
        yaml += `
  - name: ${volumeName}`;
        
        switch (volumeType) {
          case 'emptyDir':
            yaml += `
    emptyDir: {}`;
            break;
          case 'hostPath':
            const hostPath = document.getElementById(`hostPath${i}`)?.value;
            const hostPathType = document.getElementById(`hostPathType${i}`)?.value;
            if (hostPath) {
              yaml += `
    hostPath:
      path: ${hostPath}`;
              if (hostPathType) {
                yaml += `
      type: ${hostPathType}`;
              }
            }
            break;
          case 'configMap':
            const configMapName = document.getElementById(`configMapName${i}`)?.value;
            const configMapItems = document.getElementById(`configMapItems${i}`)?.value;
            if (configMapName) {
              yaml += `
    configMap:
      name: ${configMapName}`;
              if (configMapItems) {
                try {
                  const items = JSON.parse(configMapItems);
                  yaml += `
      items:`;
                  items.forEach(item => {
                    yaml += `
      - key: ${item.key}
        path: ${item.path}`;
                  });
                } catch (e) {
                  console.warn("Invalid JSON for configMap items");
                }
              }
            }
            break;
          case 'secret':
            const secretName = document.getElementById(`secretName${i}`)?.value;
            const secretItems = document.getElementById(`secretItems${i}`)?.value;
            if (secretName) {
              yaml += `
    secret:
      secretName: ${secretName}`;
              if (secretItems) {
                try {
                  const items = JSON.parse(secretItems);
                  yaml += `
      items:`;
                  items.forEach(item => {
                    yaml += `
      - key: ${item.key}
        path: ${item.path}`;
                  });
                } catch (e) {
                  console.warn("Invalid JSON for secret items");
                }
              }
            }
            break;
          case 'persistentVolumeClaim':
            const pvcName = document.getElementById(`pvcName${i}`)?.value;
            if (pvcName) {
              yaml += `
    persistentVolumeClaim:
      claimName: ${pvcName}`;
            }
            break;
        }
      }
    }
  }

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const cpuRequest = document.getElementById("cpuRequest")?.value;
    const memoryRequest = document.getElementById("memoryRequest")?.value;
    const cpuLimit = document.getElementById("cpuLimit")?.value;
    const memoryLimit = document.getElementById("memoryLimit")?.value;
    const envVars = document.getElementById("envVars")?.value;

    // Add resources if specified
    if (cpuRequest || memoryRequest || cpuLimit || memoryLimit) {
      yaml = yaml.replace(
        `    ports:
    - containerPort: ${port}`,
        `    ports:
    - containerPort: ${port}
    resources:`
      );

      if (cpuRequest || memoryRequest) {
        yaml += `
      requests:`;
        if (cpuRequest) yaml += `
        cpu: ${cpuRequest}`;
        if (memoryRequest) yaml += `
        memory: ${memoryRequest}`;
      }

      if (cpuLimit || memoryLimit) {
        yaml += `
      limits:`;
        if (cpuLimit) yaml += `
        cpu: ${cpuLimit}`;
        if (memoryLimit) yaml += `
        memory: ${memoryLimit}`;
      }
    }

    // Add environment variables if specified
    if (envVars) {
      try {
        const envObj = JSON.parse(envVars);
        yaml = yaml.replace(
          `    ports:
    - containerPort: ${port}`,
          `    ports:
    - containerPort: ${port}
    env:`
        );
        Object.entries(envObj).forEach(([key, value]) => {
          yaml += `
    - name: ${key}
      value: "${value}"`;
        });
      } catch (e) {
        console.warn("Invalid JSON for environment variables");
      }
    }

    // Add sidecars if specified
    const sidecarCount = document.getElementById("sidecarCount")?.value || 0;
    for (let i = 0; i < sidecarCount; i++) {
      const sidecarName = document.getElementById(`sidecarName${i}`)?.value || `sidecar-${i + 1}`;
      const sidecarImage = document.getElementById(`sidecarImage${i}`)?.value || 'busybox';
      const sidecarCommand = document.getElementById(`sidecarCommand${i}`)?.value || 'sleep 3600';
      
      yaml += `
  - name: ${sidecarName}
    image: ${sidecarImage}
    command: ["${sidecarCommand.split(' ').join('", "')}"]`;
    }
  }

  return yaml;
}

function generateDeploymentYAML() {
  const name = document.getElementById("name").value || 'my-deployment';
  const image = document.getElementById("image").value || 'nginx';
  const port = document.getElementById("port").value || '80';
  const replicas = document.getElementById("replicas").value || '3';
  const command = document.getElementById("command")?.value;
  const args = document.getElementById("args")?.value;

  let containerSpec = `      - name: ${name}
        image: ${image}`;

  // Add command if specified
  if (command) {
    const commandArray = command.trim().split(/\s+/).map(c => `"${c}"`).join(', ');
    containerSpec += `
        command: [${commandArray}]`;
  }

  // Add args if specified
  if (args) {
    const argsArray = args.trim().split(/\s+/).map(a => `"${a}"`).join(', ');
    containerSpec += `
        args: [${argsArray}]`;
  }

  // Add ports
  containerSpec += `
        ports:
        - containerPort: ${port}`;

  // Add volume mounts
  const volumeCount = parseInt(document.getElementById("volumeCount")?.value || 0);
  if (volumeCount > 0) {
    containerSpec += `
        volumeMounts:`;
    for (let i = 0; i < volumeCount; i++) {
      const volumeName = document.getElementById(`volumeName${i}`)?.value || `volume-${i + 1}`;
      const mountPath = document.getElementById(`mountPath${i}`)?.value;
      const readOnly = document.getElementById(`readOnly${i}`)?.checked;
      
      if (mountPath) {
        containerSpec += `
        - name: ${volumeName}
          mountPath: ${mountPath}`;
        if (readOnly) {
          containerSpec += `
          readOnly: true`;
        }
      }
    }
  }

  let yaml = `apiVersion: apps/v1
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
${containerSpec}`;

  // Add volumes
  if (volumeCount > 0) {
    yaml += `
      volumes:`;
    for (let i = 0; i < volumeCount; i++) {
      const volumeName = document.getElementById(`volumeName${i}`)?.value || `volume-${i + 1}`;
      const volumeType = document.getElementById(`volumeType${i}`)?.value || 'emptyDir';
      const mountPath = document.getElementById(`mountPath${i}`)?.value;
      
      if (mountPath) {
        yaml += `
      - name: ${volumeName}`;
        
        switch (volumeType) {
          case 'emptyDir':
            yaml += `
        emptyDir: {}`;
            break;
          case 'hostPath':
            const hostPath = document.getElementById(`hostPath${i}`)?.value;
            const hostPathType = document.getElementById(`hostPathType${i}`)?.value;
            if (hostPath) {
              yaml += `
        hostPath:
          path: ${hostPath}`;
              if (hostPathType) {
                yaml += `
          type: ${hostPathType}`;
              }
            }
            break;
          case 'configMap':
            const configMapName = document.getElementById(`configMapName${i}`)?.value;
            const configMapItems = document.getElementById(`configMapItems${i}`)?.value;
            if (configMapName) {
              yaml += `
        configMap:
          name: ${configMapName}`;
              if (configMapItems) {
                try {
                  const items = JSON.parse(configMapItems);
                  yaml += `
          items:`;
                  items.forEach(item => {
                    yaml += `
          - key: ${item.key}
            path: ${item.path}`;
                  });
                } catch (e) {
                  console.warn("Invalid JSON for configMap items");
                }
              }
            }
            break;
          case 'secret':
            const secretName = document.getElementById(`secretName${i}`)?.value;
            const secretItems = document.getElementById(`secretItems${i}`)?.value;
            if (secretName) {
              yaml += `
        secret:
          secretName: ${secretName}`;
              if (secretItems) {
                try {
                  const items = JSON.parse(secretItems);
                  yaml += `
          items:`;
                  items.forEach(item => {
                    yaml += `
          - key: ${item.key}
            path: ${item.path}`;
                  });
                } catch (e) {
                  console.warn("Invalid JSON for secret items");
                }
              }
            }
            break;
          case 'persistentVolumeClaim':
            const pvcName = document.getElementById(`pvcName${i}`)?.value;
            if (pvcName) {
              yaml += `
        persistentVolumeClaim:
          claimName: ${pvcName}`;
            }
            break;
        }
      }
    }
  }

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const strategyType = document.getElementById("strategyType")?.value;
    const maxUnavailable = document.getElementById("maxUnavailable")?.value;
    const maxSurge = document.getElementById("maxSurge")?.value;
    const cpuRequest = document.getElementById("cpuRequest")?.value;
    const memoryRequest = document.getElementById("memoryRequest")?.value;
    const cpuLimit = document.getElementById("cpuLimit")?.value;
    const memoryLimit = document.getElementById("memoryLimit")?.value;
    const envVars = document.getElementById("envVars")?.value;

    // Add strategy if specified
    if (strategyType) {
      yaml = yaml.replace(
        `spec:
  replicas: ${replicas}`,
        `spec:
  replicas: ${replicas}
  strategy:
    type: ${strategyType}`
      );

      if (strategyType === 'RollingUpdate' && (maxUnavailable || maxSurge)) {
        yaml += `
    rollingUpdate:`;
        if (maxUnavailable) yaml += `
      maxUnavailable: ${maxUnavailable}`;
        if (maxSurge) yaml += `
      maxSurge: ${maxSurge}`;
      }
    }

    // Add resources if specified
    if (cpuRequest || memoryRequest || cpuLimit || memoryLimit) {
      yaml += `
        resources:`;

      if (cpuRequest || memoryRequest) {
        yaml += `
          requests:`;
        if (cpuRequest) yaml += `
            cpu: ${cpuRequest}`;
        if (memoryRequest) yaml += `
            memory: ${memoryRequest}`;
      }

      if (cpuLimit || memoryLimit) {
        yaml += `
          limits:`;
        if (cpuLimit) yaml += `
            cpu: ${cpuLimit}`;
        if (memoryLimit) yaml += `
            memory: ${memoryLimit}`;
      }
    }

    // Add environment variables if specified
    if (envVars) {
      try {
        const envObj = JSON.parse(envVars);
        yaml += `
        env:`;
        Object.entries(envObj).forEach(([key, value]) => {
          yaml += `
        - name: ${key}
          value: "${value}"`;
        });
      } catch (e) {
        console.warn("Invalid JSON for environment variables");
      }
    }
  }

  return yaml;
}

function generateServiceYAML() {
  const name = document.getElementById("name").value || 'my-service';
  const port = document.getElementById("port").value || '80';
  const targetPort = document.getElementById("targetPort").value || '80';
  const serviceType = document.getElementById("serviceType").value || 'ClusterIP';
  const appSelector = document.getElementById("appSelector").value || name;

  let yaml = `apiVersion: v1
kind: Service
metadata:
  name: ${name}
spec:
  selector:
    app: ${appSelector}
  type: ${serviceType}
  ports:
  - protocol: TCP
    port: ${port}
    targetPort: ${targetPort}`;

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const protocol = document.getElementById("protocol")?.value;
    const sessionAffinity = document.getElementById("sessionAffinity")?.value;
    const externalTrafficPolicy = document.getElementById("externalTrafficPolicy")?.value;
    const additionalSelectors = document.getElementById("additionalSelectors")?.value;

    if (protocol && protocol !== 'TCP') {
      yaml = yaml.replace('protocol: TCP', `protocol: ${protocol}`);
    }

    if (sessionAffinity && sessionAffinity !== 'None') {
      yaml += `
  sessionAffinity: ${sessionAffinity}`;
    }

    if (externalTrafficPolicy && externalTrafficPolicy !== 'Cluster' && (serviceType === 'NodePort' || serviceType === 'LoadBalancer')) {
      yaml += `
  externalTrafficPolicy: ${externalTrafficPolicy}`;
    }

    // Add additional selectors if specified
    if (additionalSelectors) {
      try {
        const selectorObj = JSON.parse(additionalSelectors);
        Object.entries(selectorObj).forEach(([key, value]) => {
          yaml = yaml.replace(
            `  selector:
    app: ${appSelector}`,
            `  selector:
    app: ${appSelector}
    ${key}: ${value}`
          );
        });
      } catch (e) {
        console.warn("Invalid JSON for additional selectors");
      }
    }
  }

  return yaml;
}

function generateConfigMapYAML() {
  const name = document.getElementById("name").value || 'my-configmap';
  const data = document.getElementById("data").value || '{}';

  let yaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${name}`;

  try {
    const dataObj = JSON.parse(data);
    if (Object.keys(dataObj).length > 0) {
      yaml += `
data:`;
      Object.entries(dataObj).forEach(([key, value]) => {
        yaml += `
  ${key}: |
    ${value}`;
      });
    }
  } catch (e) {
    yaml += `
data:
  config: |
    # Add your configuration here`;
  }

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const binaryData = document.getElementById("binaryData")?.value;
    const immutable = document.getElementById("immutable")?.value;

    if (binaryData) {
      try {
        const binaryObj = JSON.parse(binaryData);
        if (Object.keys(binaryObj).length > 0) {
          yaml += `
binaryData:`;
          Object.entries(binaryObj).forEach(([key, value]) => {
            yaml += `
  ${key}: ${value}`;
          });
        }
      } catch (e) {
        console.warn("Invalid JSON for binary data");
      }
    }

    if (immutable === 'true') {
      yaml += `
immutable: true`;
    }
  }

  return yaml;
}

function generateSecretYAML() {
  const name = document.getElementById("name").value || 'my-secret';
  const secretType = document.getElementById("secretType").value || 'Opaque';
  const data = document.getElementById("data").value || '{}';

  let yaml = `apiVersion: v1
kind: Secret
metadata:
  name: ${name}
type: ${secretType}`;

  try {
    const dataObj = JSON.parse(data);
    if (Object.keys(dataObj).length > 0) {
      yaml += `
data:`;
      Object.entries(dataObj).forEach(([key, value]) => {
        yaml += `
  ${key}: ${value}`;
      });
    }
  } catch (e) {
    yaml += `
data:
  username: dXNlcm5hbWU=  # base64 encoded
  password: cGFzc3dvcmQ=  # base64 encoded`;
  }

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const stringData = document.getElementById("stringData")?.value;
    const immutable = document.getElementById("immutable")?.value;

    if (stringData) {
      try {
        const stringObj = JSON.parse(stringData);
        if (Object.keys(stringObj).length > 0) {
          yaml += `
stringData:`;
          Object.entries(stringObj).forEach(([key, value]) => {
            yaml += `
  ${key}: ${value}`;
          });
        }
      } catch (e) {
        console.warn("Invalid JSON for string data");
      }
    }

    if (immutable === 'true') {
      yaml += `
immutable: true`;
    }
  }

  return yaml;
}

function generateNamespaceYAML() {
  const name = document.getElementById("name").value || 'my-namespace';

  let yaml = `apiVersion: v1
kind: Namespace
metadata:
  name: ${name}`;

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const labels = document.getElementById("labels")?.value;
    const annotations = document.getElementById("annotations")?.value;

    if (labels) {
      try {
        const labelObj = JSON.parse(labels);
        if (Object.keys(labelObj).length > 0) {
          yaml += `
  labels:`;
          Object.entries(labelObj).forEach(([key, value]) => {
            yaml += `
    ${key}: ${value}`;
          });
        }
      } catch (e) {
        console.warn("Invalid JSON for labels");
      }
    }

    if (annotations) {
      try {
        const annotationObj = JSON.parse(annotations);
        if (Object.keys(annotationObj).length > 0) {
          yaml += `
  annotations:`;
          Object.entries(annotationObj).forEach(([key, value]) => {
            yaml += `
    ${key}: ${value}`;
          });
        }
      } catch (e) {
        console.warn("Invalid JSON for annotations");
      }
    }
  }

  return yaml;
}

function generateServiceAccountYAML() {
  const name = document.getElementById("name").value || 'my-service-account';

  let yaml = `apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${name}`;

  // Add pro mode features if available
  if (currentMode === 'pro') {
    const automount = document.getElementById("automountServiceAccountToken")?.value;
    const imagePullSecrets = document.getElementById("imagePullSecrets")?.value;
    const secrets = document.getElementById("secrets")?.value;

    if (automount === 'false') {
      yaml += `
automountServiceAccountToken: false`;
    }

    if (imagePullSecrets) {
      const secretList = imagePullSecrets.split(',').map(s => s.trim()).filter(s => s);
      if (secretList.length > 0) {
        yaml += `
imagePullSecrets:`;
        secretList.forEach(secret => {
          yaml += `
- name: ${secret}`;
        });
      }
    }

    if (secrets) {
      const secretList = secrets.split(',').map(s => s.trim()).filter(s => s);
      if (secretList.length > 0) {
        yaml += `
secrets:`;
        secretList.forEach(secret => {
          yaml += `
- name: ${secret}`;
        });
      }
    }
  }

  return yaml;
}

function downloadYAML() {
  const text = document.getElementById("output").textContent;
  if (!text) {
    alert("No YAML to download. Please generate YAML first.");
    return;
  }
  
  const blob = new Blob([text], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "k8s-resource.yaml";
  a.click();
  URL.revokeObjectURL(url);
}

function copyToClipboard() {
  let text;
  
  if (isEditMode) {
    text = document.getElementById("yamlEditor").value;
  } else {
    text = document.getElementById("output").textContent;
  }
  
  if (!text) {
    alert("No YAML to copy. Please generate YAML first.");
    return;
  }
  
  navigator.clipboard.writeText(text).then(() => {
    alert("YAML copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert("Failed to copy to clipboard. Please copy manually.");
  });
}

// YAML Editor functionality

function toggleEditMode() {
  const output = document.getElementById("output");
  const editorContainer = document.getElementById("editorContainer");
  const editor = document.getElementById("yamlEditor");
  const editToggle = document.getElementById("editToggle");
  const validateButton = document.getElementById("validateButton");
  const resetButton = document.getElementById("resetButton");
  
  isEditMode = !isEditMode;
  
  if (isEditMode) {
    // Switch to edit mode
    const currentYAML = output.textContent;
    if (currentYAML.trim()) {
      editor.value = currentYAML;
      output.style.display = 'none';
      editorContainer.style.display = 'block';
      editToggle.innerHTML = '👁️ Preview';
      editToggle.style.background = '#6c757d';
      validateButton.style.display = 'inline-block';
      resetButton.style.display = 'inline-block';
      
      // Focus the editor
      setTimeout(() => editor.focus(), 100);
      
      // Add real-time validation
      editor.addEventListener('input', debounce(validateYAMLRealtime, 500));
      
      // Initial validation
      validateYAML();
    } else {
      alert("Please generate YAML first before editing.");
      isEditMode = false;
    }
  } else {
    // Switch to preview mode
    const editedYAML = editor.value;
    output.textContent = editedYAML;
    output.style.display = 'block';
    editorContainer.style.display = 'none';
    editToggle.innerHTML = '📝 Edit YAML';
    editToggle.style.background = '#28a745';
    validateButton.style.display = 'none';
    resetButton.style.display = 'none';
    clearValidationStatus();
  }
}

function validateYAML() {
  const editor = document.getElementById("yamlEditor");
  const yaml = editor.value;
  
  try {
    // Basic YAML validation
    const lines = yaml.split('\n');
    const errors = [];
    
    // Check for basic YAML structure
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      
      // Check for tabs (YAML should use spaces)
      if (line.includes('\t')) {
        errors.push(`Line ${lineNum}: Use spaces instead of tabs`);
      }
      
      // Check for basic indentation consistency
      if (line.trim() && line.match(/^( +)/)) {
        const spaces = line.match(/^( +)/)[1].length;
        if (spaces % 2 !== 0) {
          errors.push(`Line ${lineNum}: Indentation should be multiples of 2 spaces`);
        }
      }
      
      // Check for missing colons in key-value pairs
      if (line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('-') && line.includes(':')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === line.length - 1 || line[colonIndex + 1] !== ' ') {
          // Only warn if it's not a URL or time format
          if (!line.includes('http') && !line.includes('://') && !line.match(/\d{2}:\d{2}/)) {
            errors.push(`Line ${lineNum}: Missing space after colon`);
          }
        }
      }
    }
    
    // Check for required Kubernetes fields
    if (!yaml.includes('apiVersion:')) {
      errors.push('Missing required field: apiVersion');
    }
    if (!yaml.includes('kind:')) {
      errors.push('Missing required field: kind');
    }
    if (!yaml.includes('metadata:')) {
      errors.push('Missing required field: metadata');
    }
    
    const statusElement = document.getElementById("validationStatus");
    
    if (errors.length === 0) {
      statusElement.innerHTML = '✅ YAML looks good!';
      statusElement.style.color = '#28a745';
    } else {
      statusElement.innerHTML = `⚠️ ${errors.length} issue(s) found`;
      statusElement.style.color = '#dc3545';
      
      // Show first few errors
      const errorList = errors.slice(0, 3).join('; ');
      statusElement.title = errorList;
    }
    
  } catch (error) {
    const statusElement = document.getElementById("validationStatus");
    statusElement.innerHTML = '❌ Invalid YAML';
    statusElement.style.color = '#dc3545';
    statusElement.title = error.message;
  }
}

function validateYAMLRealtime() {
  if (isEditMode) {
    validateYAML();
  }
}

function clearValidationStatus() {
  document.getElementById("validationStatus").innerHTML = '';
}

function resetToGenerated() {
  if (originalGeneratedYAML) {
    const editor = document.getElementById("yamlEditor");
    editor.value = originalGeneratedYAML;
    validateYAML();
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
