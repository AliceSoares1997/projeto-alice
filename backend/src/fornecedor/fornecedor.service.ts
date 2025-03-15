import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { Fornecedor } from './fornecedor.entity';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>,
  ) {}

  async create(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    const fornecedor = this.fornecedorRepository.create({
      nome: createFornecedorDto.nome,
      cnpj: createFornecedorDto.cnpj,
      endereco: createFornecedorDto.endereco,
      telefone: createFornecedorDto.telefone,
      email: createFornecedorDto.email,
      contatoPrincipal: createFornecedorDto.contato_principal,
    });
    return this.fornecedorRepository.save(fornecedor);
  }

  async findById(id: number): Promise<Fornecedor | null> {
    return this.fornecedorRepository.findOne({ where: { id } });
  }

  async findByCnpj(cnpj: string): Promise<Fornecedor | null> {
    return this.fornecedorRepository.findOne({ where: { cnpj } });
  }

  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedorRepository.find();
  }

  async update(
    id: number,
    updateFornecedorDto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    const fornecedor = await this.findById(id);
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    this.fornecedorRepository.merge(fornecedor, updateFornecedorDto);
    return this.fornecedorRepository.save(fornecedor);
  }

  async delete(id: number): Promise<void> {
    const result = await this.fornecedorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
  }
}
