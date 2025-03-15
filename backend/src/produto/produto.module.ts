import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoFornecedorController } from 'src/produto-fornecedor/produto-fornecedor.controller';
import { ProdutoFornecedor } from 'src/produto-fornecedor/produto-fornecedor.entity';
import { ProdutoFornecedorService } from 'src/produto-fornecedor/produto-fornecedor.service';
import { ProdutoController } from './produto.controller';
import { Produto } from './produto.entity';
import { ProdutoService } from './produto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, ProdutoFornecedor])],
  controllers: [ProdutoController, ProdutoFornecedorController],
  providers: [ProdutoService, ProdutoFornecedorService],
  exports: [ProdutoService, ProdutoFornecedorService],
})
export class ProdutoModule {}
