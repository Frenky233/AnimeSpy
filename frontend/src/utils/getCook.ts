export function getCook(cookieName: string) {
  const cookieString = RegExp(cookieName + "=[^;]+").exec(document.cookie);

  return decodeURIComponent(
    !!cookieString ? cookieString.toString().replace(/^[^=]+./, "") : ""
  );
}
