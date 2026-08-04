import shutil
import os

src_aab = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\twa_project\app\build\outputs\bundle\release\app-release.aab"
dst_aab_1 = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\pwabuilder_package\Esle_Gitsin_3D_v7.1.0_FinalMaster_versionCode14_Signed.aab"
dst_aab_2 = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\Esle_Gitsin_3D_v7.1.0_FinalMaster_versionCode14_Signed.aab"

shutil.copyfile(src_aab, dst_aab_1)
shutil.copyfile(src_aab, dst_aab_2)

print("Copied FinalMaster versionCode 14 signed bundle successfully!")
print("Dst 1 size:", os.path.getsize(dst_aab_1))
print("Dst 2 size:", os.path.getsize(dst_aab_2))
