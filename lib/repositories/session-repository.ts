export interface SessionRepository {
  save(): Promise<void>;
}

export const localSessionRepository: SessionRepository = {
  async save() {
    return Promise.resolve();
  },
};
