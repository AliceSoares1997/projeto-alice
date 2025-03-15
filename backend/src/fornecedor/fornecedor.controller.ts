import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { FornecedorService } from './fornecedor.service';

@Controller('fornecedor')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) {}

  @Post()
  async create(@Body() createFornecedorDto: CreateFornecedorDto) {
    const fornecedor = await this.fornecedorService.findByCnpj(
      createFornecedorDto.cnpj,
    );

    if (fornecedor) {
      throw new ConflictException('Fornecedor com este CNPJ já cadastrado');
    }

    return this.fornecedorService.create(createFornecedorDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const fornecedor = await this.fornecedorService.findById(id);
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    return fornecedor;
  }

  @Get()
  async findAll() {
    return this.fornecedorService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFornecedorDto: UpdateFornecedorDto,
  ) {
    const fornecedor = await this.fornecedorService.findById(id);
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    const cnpj = updateFornecedorDto.cnpj;
    if (cnpj !== fornecedor.cnpj && cnpj) {
      const outroFornecedor = await this.fornecedorService.findByCnpj(cnpj);
      if (outroFornecedor) {
        throw new ConflictException('CNPJ já cadastrado por outro fornecedor');
      }
    }
    return this.fornecedorService.update(id, updateFornecedorDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const fornecedor = await this.fornecedorService.findById(id);
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    await this.fornecedorService.delete(id);
    return {
      message: 'Fornecedor deletado com sucesso',
    };
  }
}
