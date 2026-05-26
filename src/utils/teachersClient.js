const buildUrl = (path) => {
  const base = process.env.TEACHERS_SERVICE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, '')}${path}`;
};

const fetchJson = async (url, authToken) => {
  const timeoutMs = parseInt(process.env.TEACHERS_SERVICE_TIMEOUT_MS, 10) || 3000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: authToken ? { Authorization: authToken } : {}
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const getTeacherDisciplineIds = async (teacherId, authToken) => {
  const url = buildUrl(`/teachers/disciplines/${encodeURIComponent(teacherId)}`);
  if (!url) return null;
  const data = await fetchJson(url, authToken);
  return Array.isArray(data?.discipline_ids) ? data.discipline_ids : null;
};

const getTeacherById = async (teacherId, authToken) => {
  const url = buildUrl(`/teachers/listTeacherById/${encodeURIComponent(teacherId)}`);
  if (!url) return null;
  return await fetchJson(url, authToken);
};

module.exports = { getTeacherDisciplineIds, getTeacherById };
