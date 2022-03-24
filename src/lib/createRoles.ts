import Role from '../db/schemas/Role.schema';
import InternalServerException from '../exceptions/InternalServerError';

// sets the roles in the dabatase before app routes are loaded
export default async function createRoles() {
  try {
    const roleCount = await Role.estimatedDocumentCount();

    if (roleCount > 0) return;

    await Promise.all([
      new Role({ name: 'CEO' }).save(),
      new Role({ name: 'CTO' }).save(),
      new Role({ name: 'RRHH ADMIN' }).save(),
      new Role({ name: 'RRHH' }).save(),
      new Role({ name: 'COMMON' }).save(),
    ]);
  } catch (e: any) {
    return new InternalServerException(
      `There was an unexpected error with the roles creation. ${e.message}`,
    );
  }
}
