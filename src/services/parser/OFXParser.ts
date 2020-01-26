import { Inject, Service } from 'typedi';
import * as fs from 'fs';
import ofx from 'ofx';
import { Logger } from 'winston';
import MovementService from '../MovementService';
import { MovementAttributes } from '../../models/Movement';
import moment from 'moment';

@Service()
export default class OFXParser {
  @Inject('logger')
  private readonly logger: Logger;

  @Inject()
  private readonly movementService: MovementService;

  parseFile = (path): Promise<MovementAttributes[]> =>
    new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function(error, ofxData) {
        if (error) {
          reject(error);
        }

        const data = ofx.parse(ofxData);
        const movements = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.map(transfert => ({
          fitId: transfert.FITID,
          amount: Number.parseFloat(transfert.TRNAMT),
          categoryId: 0,
          date: moment(transfert.DTPOSTED, 'YYYYMMDD')
            .utc()
            .toDate(),
          label: transfert.NAME + (transfert.MEMO !== '.' ? ` Memo: (${transfert.MEMO})` : ''),
        }));
        resolve(movements);
      });
    });
}
