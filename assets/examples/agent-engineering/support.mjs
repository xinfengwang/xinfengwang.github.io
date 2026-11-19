import assert from 'node:assert/strict';

const orders = [
  { id: 'A12', userId: 'u1', region: 'CN', state: 'in_transit' },
  { id: 'B13', userId: 'u2', region: 'CN', state: 'delivered' },
];
const policy = [
  { id: 'refund-v1', region: 'CN', active: false, text: 'Use the legacy form.' },
  { id: 'refund-v2', region: 'CN', active: true, text: 'Contact support to review an in-transit order.' },
];

function readOwnOrder(userId, orderId) {
  if (!userId) return undefined;
  return orders.find(order => order.id === orderId && order.userId === userId);
}

function answer(session, request, policies = policy) {
  if (!request.orderId) return { status: 'needs_order' };
  const receipt = readOwnOrder(session.userId, request.orderId);
  if (!receipt) return { status: 'unavailable' };
  const evidence = policies.find(item => item.region === receipt.region && item.active);
  if (!evidence) return { status: 'needs_evidence' };
  return {
    status: request.refundNow ? 'handoff' : 'complete',
    orderId: receipt.id,
    shipment: receipt.state,
    policy: evidence.text,
    citations: ['order:' + receipt.id, evidence.id],
  };
}

const session = { userId: 'u1' };
const covered = answer(session, { orderId: 'A12' });
assert.equal(covered.shipment, 'in_transit');
assert.deepEqual(covered.citations, ['order:A12', 'refund-v2']);
const cases = [
  [covered, 'complete'],
  [answer(session, {}), 'needs_order'],
  [answer(session, { orderId: 'B13' }), 'unavailable'],
  [answer(session, { orderId: 'A12', refundNow: true }), 'handoff'],
  [answer(session, { orderId: 'A12' }, [policy[0]]), 'needs_evidence'],
];
for (const [result, status] of cases) assert.equal(result.status, status);
assert.deepEqual(cases[2][0], { status: 'unavailable' });
console.table(cases.map(([result]) => result));
