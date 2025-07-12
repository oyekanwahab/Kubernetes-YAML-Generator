# Kubernetes YAML Generator

A modern, user-friendly web application for generating Kubernetes YAML configurations with ease. Whether you're a beginner learning Kubernetes or an experienced developer who wants to quickly generate YAML files, this tool has you covered.

![Kubernetes YAML Generator](https://img.shields.io/badge/Kubernetes-YAML-blue?style=for-the-badge&logo=kubernetes)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🌐 Live Demo

**🔗 [Try it live on GitHub Pages!](https://oyekanwahab.github.io/Kubernetes-YAML-Generator/)**

*Note: The live demo is automatically updated when changes are pushed to the main branch.*

## 🚀 Features

### 📋 **Supported Kubernetes Resources**
- **Pods** - Basic container orchestration
- **Deployments** - Scalable application deployments
- **Services** - Network access to applications
- **ConfigMaps** - Configuration data management
- **Secrets** - Sensitive data management
- **Namespaces** - Resource organization
- **ServiceAccounts** - Identity and access management
- **PersistentVolumes & PersistentVolumeClaims** - Storage management
- **Ingress** - External access management
- **Jobs & CronJobs** - Batch workloads
- **DaemonSets** - Node-level services
- **StatefulSets** - Stateful applications
- **RBAC (Roles, RoleBindings, ClusterRoles, ClusterRoleBindings)** - Security
- **NetworkPolicies** - Network security
- **HorizontalPodAutoscaler** - Auto-scaling

### 🎯 **Dual Generation Modes**

#### **Easy Mode** 
Perfect for beginners and quick deployments
- Simple, essential fields only
- Pre-configured sensible defaults
- Minimal complexity

#### **Pro Mode** 
Advanced configuration for production deployments
- Resource limits and requests
- Environment variables
- Advanced networking options
- Security contexts
- Volume mounting
- Deployment strategies
- And much more...

### 🐳 **Smart Image Selection**
- **25+ Popular Docker Images** organized by category:
  - Web Servers (nginx, httpd, traefik)
  - Databases (mysql, postgres, mongo, redis)
  - Application Runtimes (node, python, java, golang)
  - Operating Systems (ubuntu, alpine, busybox)
  - Monitoring & DevOps (grafana, prometheus, jenkins)
- **Custom Image Support** - Enter any Docker image
- **Registry Support** - Works with Docker Hub, private registries, GCR, ECR, etc.

### ⚙️ **Advanced Configuration**
- **Container Commands & Arguments** - Override image entrypoints
- **Volume Mounting** with support for:
  - EmptyDir (temporary storage)
  - HostPath (host machine directories)
  - ConfigMaps (configuration files)
  - Secrets (sensitive files)
  - PersistentVolumeClaims (persistent storage)
- **Resource Management** - CPU and memory limits/requests
- **Environment Variables** - JSON-based configuration
- **Sidecar Containers** - Multi-container pods
- **Network Policies** - Security and traffic control

### 🎨 **Modern User Interface**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful Gradient Theme** - Professional appearance
- **Form Validation** - Real-time feedback
- **Smart Defaults** - Sensible pre-filled values
- **Category Organization** - Grouped options for easy navigation

### 📁 **Export Options**
- **Generate YAML** - Live preview with syntax highlighting
- **Download Files** - Save as `.yaml` files
- **Copy to Clipboard** - Quick sharing and deployment

## 🛠️ Installation & Usage

### **Method 1: Direct Download**
```bash
git clone https://github.com/oyekanwahab/Kubernetes-YAML-Generator.git
cd Kubernetes-YAML-Generator
```

### **Method 2: Open in Browser**
Simply open `index.html` in your web browser - no server required!

### **Method 3: Local Server** (Optional)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📖 How to Use

### **Basic Workflow**

1. **Choose Generation Mode**
   - Select "Easy Mode" for simple configurations
   - Select "Pro Mode" for advanced features

2. **Select Resource Type**
   - Pick from 20+ Kubernetes resources

3. **Configure Your Resource**
   - Fill in the generated form fields
   - Use dropdown suggestions or enter custom values

4. **Generate YAML**
   - Click "Generate YAML" to see the output
   - Review the generated configuration

5. **Export Your Configuration**
   - Copy to clipboard for quick use
   - Download as a file for version control
   - Deploy directly to your cluster

### **Example: Creating a Web Application**

1. **Select Deployment** from the resource dropdown
2. **Choose nginx** from the image dropdown (or enter your custom image)
3. **Set replicas** to your desired count
4. **Add volume mounts** if you need persistent storage
5. **Configure environment variables** in Pro mode
6. **Generate and deploy** your YAML

## 💡 Use Cases

### **For Beginners**
- Learning Kubernetes YAML structure
- Understanding resource relationships
- Quick prototyping and testing
- Educational purposes

### **For Developers**
- Rapid application deployment
- Configuration templating
- Development environment setup
- CI/CD pipeline integration

### **For DevOps Engineers**
- Production-ready configurations
- Security-hardened deployments
- Complex multi-container applications
- Infrastructure as Code

## 🔧 Technical Details

### **Technology Stack**
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design patterns
- **Architecture**: Client-side only, no backend required
- **Compatibility**: All modern browsers

### **File Structure**
```
├── index.html          # Main application file
├── css/
│   └── style.css      # Styling and themes
├── js/
│   └── main.js        # Application logic
└── README.md          # This file
```

### **Features Implementation**
- **Form Generation**: Dynamic form rendering based on resource type
- **YAML Generation**: Template-based YAML construction
- **Validation**: Client-side form validation and error handling
- **State Management**: Mode switching and form state preservation

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Adding New Resources**
1. Add the resource to the dropdown in `index.html`
2. Create a render function in `js/main.js` (e.g., `renderJobForm()`)
3. Create a YAML generation function (e.g., `generateJobYAML()`)
4. Add the resource to the switch statement in `renderForm()` and `generateYAML()`

### **Improving Existing Features**
- Enhance form validation
- Add more image suggestions
- Improve YAML formatting
- Add new volume types
- Enhance Pro mode features

### **Bug Reports & Feature Requests**
Please open an issue with:
- Detailed description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Browser and version information

## 📝 Examples

### **Simple Pod**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: my-app
    image: nginx
    ports:
    - containerPort: 80
  restartPolicy: Always
```

### **Production Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:v1.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        env:
        - name: NODE_ENV
          value: "production"
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
      volumes:
      - name: config-volume
        configMap:
          name: app-config
```

## 🛡️ Security Considerations

- **Client-Side Only**: No data is sent to external servers
- **No Storage**: Configurations are not saved or logged
- **Safe Defaults**: Security-conscious default values
- **Validation**: Input validation prevents malformed YAML

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kubernetes community for excellent documentation
- Docker Hub for providing popular image references
- The open-source community for inspiration and best practices

## 📧 Contact

- **GitHub**: [@oyekanwahab](https://github.com/oyekanwahab)
- **Repository**: [Kubernetes-YAML-Generator](https://github.com/oyekanwahab/Kubernetes-YAML-Generator)


---

⭐ **Star this repository** if you find it helpful!

📢 **Share with your team** to speed up Kubernetes deployments!

🔄 **Contribute** to make it even better!
