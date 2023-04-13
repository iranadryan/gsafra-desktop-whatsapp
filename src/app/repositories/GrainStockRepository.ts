import database from '../../database';
import { IGrainStockCropDomain, IGrainStockProducerDomain, IGrainStockStorageDomain } from '../../types/GrainStockTypes';
import GrainStockMapper from './mappers/GrainStockMapper';

class GrainStockRepository {
  findAllByCrop() {
    return new Promise<IGrainStockCropDomain[]>((resolve, reject) => {
      database.query(`
      select
        cultura,
        sum(total) as saldo
      from (
        select
          cultura.nome as cultura,
          sum(colheita.peso_liquido) as total
        from colheita
        inner join cultura on cultura.id = colheita.id_cultura
        where colheita.situacao = 2
        group by cultura

        union all

        select
          cultura.nome as cultura,
          sum(venda_agricultura_saida.qtde_kgs) * -1 as total
        from venda_agricultura_saida
        inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
        inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
        inner join cultura on cultura.id = venda_agricultura_item.id_cultura
        where venda_agricultura_saida.situacao = 2
        group by cultura

        union all

        select
          cultura.nome as cultura,
          sum(desconto_armazenamento_d.desconto_kg) * -1 as total
        from desconto_armazenamento_d
        inner join colheita on colheita.id = desconto_armazenamento_d.id_colheita
        inner join cultura on cultura.id = colheita.id_cultura
        where colheita.situacao = 2
        group by cultura
      ) group by cultura
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((item) => GrainStockMapper.toCropDomain(item)));
      });
    });
  }

  findAllByProducer(cropId: number) {
    return new Promise<IGrainStockProducerDomain[]>((resolve, reject) => {
      database.query(`
      select
        cliente,
        sum(total) as saldo
      from (
        select
          pessoa.razao_social as cliente,
          sum(colheita.peso_liquido) as total
        from colheita
        inner join pessoa on pessoa.id = colheita.id_cliente_silo
        where colheita.situacao = 2
        and colheita.id_cultura = ${cropId}
        group by cliente

        union all

        select
          pessoa.razao_social as cliente,
          sum(venda_agricultura_saida.qtde_kgs) * -1 as total
        from venda_agricultura_saida
        inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
        inner join venda_agricultura on venda_agricultura.id = venda_agricultura_item.id_venda_agricultura
        inner join pessoa on pessoa.id = venda_agricultura.id_cliente_silo
        where venda_agricultura_saida.situacao = 2
        and venda_agricultura_item.id_cultura = ${cropId}
        group by cliente

        union all

        select
          pessoa.razao_social as cliente,
          sum(desconto_armazenamento_d.desconto_kg) * -1 as total
        from desconto_armazenamento_d
        inner join colheita on colheita.id = desconto_armazenamento_d.id_colheita
        inner join pessoa on pessoa.id = colheita.id_cliente_silo
        where colheita.situacao = 2
        and colheita.id_cultura = ${cropId}
        group by cliente
      ) group by cliente
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((item) => GrainStockMapper.toProducerDomain(item)));
      });
    });
  }

  findAllByStorage(cropId: number) {
    return new Promise<IGrainStockStorageDomain[]>((resolve, reject) => {
      database.query(`
      select
        silo,
        sum(total) as saldo
      from (
        select
          estoque_agri_local.nome as silo,
          sum(colheita.peso_liquido) as total
        from colheita
        inner join estoque_agri_local on estoque_agri_local.id = colheita.id_estoque_agri_local
        where colheita.situacao = 2
        and colheita.id_cultura = ${cropId}
        group by silo

        union all

        select
          estoque_agri_local.nome as silo,
          sum(venda_agricultura_saida.qtde_kgs) * -1 as total
        from venda_agricultura_saida
        inner join venda_agricultura_item on venda_agricultura_item.id = venda_agricultura_saida.id_venda_agricultura_item
        inner join estoque_agri_local on estoque_agri_local.id = venda_agricultura_saida.id_estoque_agri_local
        where venda_agricultura_saida.situacao = 2
        and venda_agricultura_item.id_cultura = ${cropId}
        group by silo

        union all

        select
          estoque_agri_local.nome as silo,
          sum(desconto_armazenamento_d.desconto_kg) * -1 as total
        from desconto_armazenamento_d
        inner join colheita on colheita.id = desconto_armazenamento_d.id_colheita
        inner join estoque_agri_local on estoque_agri_local.id = colheita.id_estoque_agri_local
        where colheita.situacao = 2
        and colheita.id_cultura = ${cropId}
        group by silo
      ) group by silo
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((item) => GrainStockMapper.toStorageDomain(item)));
      });
    });
  }
}

export default new GrainStockRepository();
