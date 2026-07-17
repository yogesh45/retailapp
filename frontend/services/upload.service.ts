import api from "@/services/api";
import {
  UploadResponse,
  UploadStatusResponse,
} from "@/types/upload";

class UploadService {
  async uploadFile(
    file: File
  ): Promise<UploadResponse> {
    const formData = new FormData();

    formData.append(
      "file",
      file,
      file.name
    );

    const response =
      await api.post<UploadResponse>(
        "/uploads",
        formData
      );

    return response.data;
  }

  async getUploadStatus(
    uploadId: number
  ): Promise<UploadStatusResponse> {
    const response =
      await api.get<UploadStatusResponse>(
        `/uploads/${uploadId}/status`
      );

    return response.data;
  }
}

export default new UploadService();