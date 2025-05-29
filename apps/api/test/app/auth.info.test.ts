import info from '$auth/application/info'
import {describe, expect, it} from 'bun:test'
import {User} from '$user/domain/entity/user.entity'

describe('auth info', () => {
  it('should return public user info', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      createdBy: undefined,
      updatedBy: undefined,
      deletedBy: undefined
    }

    const result = await info({
      loggedUser: mockUser,
      accessToken: 'mock-token'
    });

    expect(result.isErr()).toBe(false);

    if (result.isOk()) {
      expect(result.value).toEqual({
          id: mockUser.id,
          email: mockUser.email,
          firstname: mockUser.firstname,
          lastname: mockUser.lastname,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
          deletedAt: mockUser.deletedAt,
          createdBy: mockUser.createdBy,
          updatedBy: mockUser.updatedBy,
          deletedBy: mockUser.deletedBy
      })
    }
  })
})