export function findPageCount(range: string): number {
  return range.split(",").reduce((total: number, number: any) => {
    const ans =
      total -
      number.split("-").reduce((tot: number, num: number) => {
        return -(tot - num);
      });
    return ans;
  }, 0);
}
