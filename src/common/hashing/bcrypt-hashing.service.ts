import * as bcrypt from 'bcryptjs';
import { HashingService } from './hashing.service';

export class BcryptHashingService extends HashingService {
  // Transform password into hashed password
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // Compares if hashed password matches with provided password
  async compare(password: string, hash: string): Promise<boolean> {
    const isValid = bcrypt.compare(password, hash);
    return isValid;
  }
}
