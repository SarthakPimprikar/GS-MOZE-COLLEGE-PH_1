// /utils/fetchInstallments.js
export async function getInstallmentPlan(studentId) {
  const res = await fetch(`/api/students/${studentId}/fee/installments`);
  const data = await res.json();
  return data;
}
