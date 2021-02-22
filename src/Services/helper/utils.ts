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

export function getInvitationResponseMessage(
  newUsers: Array<string>,
  declinedUsers: Array<string>
) {
  let sentMails = "";
  let declinedMails = "";
  let message = "";
  if (newUsers.length) {
    newUsers.forEach(email => {
      sentMails += `${email}, `;
    });
    message = message.concat(
      `Invitations sent successfully to given emails:\n ${sentMails}\n`
    );
  }
  if (declinedUsers.length) {
    declinedUsers.forEach(email => {
      declinedMails += `${email}, `;
    });
    message = message.concat(
      `Invitations were not send to given emails:\n ${declinedMails}\n`
    );
  }
  return message;
}
