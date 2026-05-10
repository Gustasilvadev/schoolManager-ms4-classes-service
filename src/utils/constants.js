module.exports = {
  ROLES: {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER'
  },
  CLASS_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: 2
  },
  DISCIPLINE_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: 2
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
    MESSAGES: {
    TOKEN_MISSING: 'Token não fornecido',
    TOKEN_INVALID: 'Token inválido ou expirado',
    FORBIDDEN: 'Acesso negado: permissão insuficiente',
    CLASS_NOT_FOUND: 'Turma não encontrada',
    CLASS_DISCIPLINE_NOT_FOUND: 'Associação turma-disciplina não encontrada',
    DISCIPLINE_NOT_FOUND: 'Disciplina não encontrada',
    STUDENT_NOT_FOUND: 'Aluno não encontrado',
    TEACHER_NOT_FOUND: 'Professor não encontrado',
    STUDENT_ALREADY_ENROLLED: 'Aluno já está matriculado nesta turma',
    TEACHER_ALREADY_ASSIGNED: 'Professor já está alocado nesta turma',
    TEACHER_NOT_QUALIFIED: 'Professor não está habilitado em nenhuma disciplina desta turma',
    DISCIPLINE_ALREADY_IN_CLASS: 'Disciplina já está associada a esta turma',
    INVALID_DATA: 'Dados inválidos',
    REQUIRED_FIELD: 'Campo obrigatório não preenchido',
    EXTERNAL_SERVICE_UNAVAILABLE: 'Serviço externo indisponível',
    CANNOT_EDIT_DELETED_CLASS: 'Não é possível editar uma turma excluída',
    CANNOT_EDIT_DELETED_DISCIPLINE: 'Não é possível editar uma disciplina excluída',
    NOT_DELETED_CANNOT_RESTORE: 'O registro não está excluído',
    CLASS_RESTORED: 'Turma restaurada com sucesso',
    DISCIPLINE_RESTORED: 'Disciplina restaurada com sucesso'
  }
};