const getTeacherDisciplineIds = async (teacherId) => {
  const baseUrl = process.env.TEACHERS_SERVICE_URL;
  if (!baseUrl) return null;

  const timeoutMs = parseInt(process.env.TEACHERS_SERVICE_TIMEOUT_MS, 10);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `${baseUrl}/teachers/disciplines/${teacherId}`,
      { method: 'GET', signal: controller.signal }
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
