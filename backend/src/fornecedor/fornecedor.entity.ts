import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProdutoFornecedor } from '../produto-fornecedor/produto-fornecedor.entity';

@Entity('fornecedor')
@Index(['cnpj'], { unique: true })
export class Fornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  nome: string;

  @Column({ length: 100, nullable: false })
  cnpj: string;

  @Column({ length: 100, nullable: false })
  endereco: string;

  @Column({ length: 100, nullable: false })
  telefone: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Column({ length: 100, nullable: false })
  contatoPrincipal: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataCadastro: Date;

  @OneToMany(
    () => ProdutoFornecedor,
    (produtoFornecedor) => produtoFornecedor.fornecedor,
    { nullable: true },
  )
  produtos?: ProdutoFornecedor[];
}
