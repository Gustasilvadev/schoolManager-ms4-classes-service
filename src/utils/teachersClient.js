const getTeacherDisciplineIds = async (teacherId, authToken) => {
  const baseUrl = process.env.TEACHERS_SERVICE_URL;
  if (!baseUrl) return null;

  const timeoutMs = parseInt(process.env.TEACHERS_SERVICE_TIMEOUT_MS, 10) || 3000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/teachers/disciplines/${encodeURIComponent(teacherId)}`,
      {
        method: 'GET',
        signal: controller.signal,
        headers: authToken ? { Authorization: authToken } : {}
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data?.discipline_ids) ? data.discipline_ids : null;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

module.exports = { getTeacherDisciplineIds };
