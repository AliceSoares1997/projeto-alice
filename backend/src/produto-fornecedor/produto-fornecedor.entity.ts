import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fornecedor } from '../fornecedor/fornecedor.entity';
import { Produto } from '../produto/produto.entity';

@Entity('produto_fornecedor')
@Index(['produto', 'fornecedor'], { unique: true })
export class ProdutoFornecedor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, (produto) => produto.produtoFornecedor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @ManyToOne(() => Fornecedor, (fornecedor) => fornecedor.produtos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;
}
