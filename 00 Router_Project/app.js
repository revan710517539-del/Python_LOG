const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const showSidebar = document.getElementById("showSidebar");
const navList = document.getElementById("navList");
const previewFrame = document.getElementById("previewFrame");
const previewEmpty = document.getElementById("previewEmpty");
const mainTitle = document.getElementById("mainTitle");
const openInNew = document.getElementById("openInNew");
const showSidebarButton = document.getElementById("showSidebar");
const appRoot = document.querySelector(".app");

const ROUTER_FILES = ["./Router.txt", "./Router"];
const PROJECT_ROOT = "../";

const normalizeEntries = (raw) =>
  raw
    .split(/;|\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [name, path] = item.split("|").map((part) => part.trim());
      return {
        name,
        path: path || name,
      };
    });

const setActive = (index) => {
  [...navList.querySelectorAll(".nav__item")].forEach((item, idx) => {
    item.classList.toggle("is-active", idx === index);
  });
};

const checkIndex = async (basePath) => {
  const indexUrl = `${basePath}/index.html`;
  const response = await fetch(indexUrl, { cache: "no-store" });
  return response.ok;
};

const routerLinkFor = (path) => `./index.html?project=${encodeURIComponent(path)}`;

const resolveProjectBase = (path) => {
  const trimmed = path.replace(/\/+$/g, "");
  if (!trimmed) {
    return PROJECT_ROOT;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `${PROJECT_ROOT}${trimmed}`;
};

const openProject = async (entry, index) => {
  const rawPath = entry.path.replace(/\/+$/g, "");
  const encodedPath = encodeURI(rawPath);
  const isHtml = encodedPath.toLowerCase().endsWith(".html");
  const baseRoot = resolveProjectBase(encodedPath);

  previewEmpty.style.display = "none";
  if (mainTitle) {
    mainTitle.textContent = entry.name;
  }
  setActive(index);

  if (openInNew) {
    openInNew.href = routerLinkFor(entry.path);
  }

  if (isHtml) {
    const target = baseRoot;
    previewFrame.removeAttribute("srcdoc");
    previewFrame.src = target;
    return;
  }

  const basePath = baseRoot;
  const distPath = `${basePath}/dist`;

  try {
    if (await checkIndex(distPath)) {
      previewFrame.src = `${distPath}/`;
      return;
    }
  } catch (error) {
    // ignore
  }

  previewFrame.src = `${basePath}/`;
};

const renderNav = (entries) => {
  if (!entries.length) {
    navList.innerHTML = "<div class=\"nav__empty\">Router.txt 未配置项目。</div>";
    return;
  }

  navList.innerHTML = "";
  entries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "nav__item";
    item.textContent = entry.name;
    item.dataset.index = String(index);
    navList.appendChild(item);
  });
};

const loadRouterFile = async () => {
  for (const file of ROUTER_FILES) {
    try {
      const response = await fetch(file, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      const text = await response.text();
      return normalizeEntries(text);
    } catch (error) {
      continue;
    }
  }
  return [];
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    query.set(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const navigateToProject = async (entries, projectPath, queryParams = {}) => {
  const normalizedPath = projectPath.replace(/\/+$/g, "");
  const encodedPath = encodeURI(normalizedPath);
  const basePath = resolveProjectBase(encodedPath);
  const distPath = `${basePath}/dist`;
  const queryString = buildQueryString(queryParams);

  previewEmpty.style.display = "none";

  const index = entries.findIndex(
    (item) => item.path === projectPath || item.name === projectPath
  );
  if (index >= 0) {
    setActive(index);
  }

  try {
    if (await checkIndex(distPath)) {
      previewFrame.src = `${distPath}/${queryString}`;
      return;
    }
  } catch (error) {
    // ignore
  }

  previewFrame.src = `${basePath}/${queryString}`;
};

const init = async () => {
  const entries = await loadRouterFile();
  renderNav(entries);

  navList.addEventListener("click", (event) => {
    const target = event.target.closest(".nav__item");
    if (!target) {
      return;
    }
    const index = Number(target.dataset.index);
    const entry = entries[index];
    if (entry) {
      openProject(entry, index);
    }
  });

  const params = new URLSearchParams(window.location.search);
  const project = params.get("project");
  if (project) {
    const index = entries.findIndex(
      (item) => item.path === project || item.name === project
    );
    if (index >= 0) {
      openProject(entries[index], index);
    }
  }

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    if (data.source !== "router") {
      return;
    }
    if (data.type === "open-customer-insight") {
      navigateToProject(entries, data.targetProject || "常熟-理财助手", {
        page: "customer",
        customerName: data.customerName,
      });
      return;
    }
    if (data.type === "open-daily-report") {
      const role = (data.role || "").toString().toLowerCase();
      const page = role === "branch" ? "overview" : "manager";
      navigateToProject(entries, data.targetProject || "常熟-理财助手", {
        page,
        role,
      });
    }
  });
};

const hideSidebar = () => {
  sidebar.classList.add("is-hidden");
  if (showSidebarButton) {
    showSidebarButton.classList.add("is-visible");
  }
  if (appRoot) {
    appRoot.classList.add("sidebar-collapsed");
  }
};

const showSidebarPanel = () => {
  sidebar.classList.remove("is-hidden");
  if (showSidebarButton) {
    showSidebarButton.classList.remove("is-visible");
  }
  if (appRoot) {
    appRoot.classList.remove("sidebar-collapsed");
  }
};

toggleSidebar.addEventListener("click", hideSidebar);
if (showSidebarButton) {
  showSidebarButton.addEventListener("click", showSidebarPanel);
}

init();
