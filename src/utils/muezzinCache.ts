export async function isMuezzinDownloaded(
  id: string,
  fileName: string,
): Promise<boolean> {
  return true; // Mock for UI Template
}

export async function downloadMuezzin(
  id: string,
  url: string,
  fileName: string,
): Promise<string> {
  return url;
}

export async function getMuezzinAudioUrl(
  id: string,
  fileName: string,
  fallbackUrl: string,
): Promise<string> {
  return fallbackUrl;
}

export async function deleteMuezzin(
  id: string,
  fileName: string,
): Promise<void> {
  return;
}
