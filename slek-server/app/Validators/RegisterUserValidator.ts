/* eslint-disable prettier/prettier */
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstname: schema.string({}, [
      rules.minLength(1),
      rules.maxLength(32),
    ]),
    lastname: schema.string({}, [
      rules.minLength(1),
      rules.maxLength(32),
    ]),
    nickname: schema.string({}, [
      rules.minLength(1),
      rules.maxLength(32),
      rules.unique({ table: 'users', column: 'nickname' })
    ]),
    email: schema.string({}, [
      rules.maxLength(255),
      rules.email(),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(255),
      rules.confirmed('password_repeated'),
    ])
  })
  
  public messages = {}
}
