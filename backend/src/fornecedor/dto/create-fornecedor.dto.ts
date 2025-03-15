import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateFornecedorDto {
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
  @IsString({ message: 'O nome da empresa deve ser uma string' })
  nome: string;

  @IsNotEmpty({ message: 'O CNPJ é obrigatório' })
  @IsString({ message: 'O CNPJ deve ser uma string' })
  cnpj: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @IsString({ message: 'O endereço deve ser uma string' })
  endereco: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString({ message: 'O telefone deve ser uma string' })
  telefone: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'O contato principal é obrigatório' })
  @IsString({ message: 'O contato principal deve ser uma string' })
  contato_principal: string;
}
