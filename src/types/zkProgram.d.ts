import {
  Field,
  PublicKey,
  Struct,
  MerkleWitness as BaseMerkleWitness,
  Signature,
} from "o1js";

const MERKLE_TREE_HEIGHT = 8; // Adjust based on your needs
class MerkleWitness extends BaseMerkleWitness(MERKLE_TREE_HEIGHT) {}

export class PrivateInputs extends Struct({
  messageSignature: Signature,
  merklePath: MerkleWitness,
}) {}

export class MessageProof extends Struct({
  senderPublicKey: PublicKey,
  messageHash: Field,
  merkleRoot: Field,
}) {}
