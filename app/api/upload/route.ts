import { NextResponse } from "next/server";
import { cloudinary, cloudinaryUploadPreset, hasCloudinaryConfig } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    if (!hasCloudinaryConfig) {
      return NextResponse.json(
        {
          error:
            "Cloudinary no está configurado. Revisa CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en .env."
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No se ha recibido ninguna imagen." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen válida." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "dblueart",
      upload_preset: cloudinaryUploadPreset
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "No se pudo subir la imagen.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
