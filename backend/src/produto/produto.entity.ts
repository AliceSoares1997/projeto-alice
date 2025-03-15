import { ProdutoFornecedor } from 'src/produto-fornecedor/produto-fornecedor.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('produto')
@Index(['codigo_barras'], {
  unique: true,
  where: '"codigo_barras" IS NOT NULL',
})
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  nome: string;

  @Column({ length: 100, nullable: true })
  codigo_barras?: string;

  @Column({ length: 100, nullable: false })
  descricao: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  estoque: number;

  @Column({ length: 100, nullable: false })
  categoria: string;

  @Column({ type: 'datetime', nullable: true })
  data_validade?: Date;

  @Column({ type: 'varchar', nullable: false })
  produto_imagem: string;

  @OneToMany(
    () => ProdutoFornecedor,
    (produtoFornecedor) => produtoFornecedor.produto,
    { nullable: true },
  )
  produtoFornecedor?: ProdutoFornecedor[];
}
